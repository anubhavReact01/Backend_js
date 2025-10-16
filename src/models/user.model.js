import mongoose , {Schema} from mongoose
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({ 

 username:{
    type: String,
    required : true,
    lowercase: true,
    unique: true,
    trim:true,
    index:true // database ke searching mai aane lagh jata hai isee sbki ni bnana hota h ye
 },

  email:{
    type: String,
    required : true,
    lowercase: true,
    unique: true,
    trim:true
 },

 fullname:{
    type: String,
    required : true,
    unique: true,
    trim:true,
    index:true
 },

 avatar:{
    type:string, // url aara hai na to wo strin hai or kaha se url aara hai through cloudinary 3rd party services
    required: true
 },

coverImage:{
    type:String, // agaim from cloudinary
},

watchHistory:[{

    type: Schema.Types.ObjectId,
    ref: "Video"
}],

password:{
    type:String,
    required :[true,"Password is required"]
},

refreshtoken:{
    type:String
}
},{timeStamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); 
    this.password = bcrypt.hash(this.password,10)  // now yaha hum password denge encrypt ke liye
    next() // ab yaha problem hai ki jb bhi data save hoga baar baar password encrypt hoga mtlb kuch bhi changes hoga ab hum yaha pre Hook use kr rahe hai to baar baar change hoga thatswhy yaha humko ek check lagana pdega 
})
// Now we encypted our password

// we check ki user jo password bheja or hum jo encrypt kiye hai wo sb same h ki ni to mongoose humko methods bhi likhne ka deta just like middlware
// to hum yaga khud ka method bnaye hao to check wese bhi milta hai methods 
userSchema.methods.isPasswordCoorrect = async function(password) {  
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
   return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
     return  jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)