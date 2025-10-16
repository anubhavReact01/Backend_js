import mongoose , {Schema} from mongoose
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2" // is package ko fir line n0 46 is manadate ki haa ab use hoga ye package isko smjhenge apn or sahi se

const videoSchema = new Schema({

   videofile:{
    type : String, // cloudinary url
    required: true
   },

   thumbnail:{
    type:String,
    required: true
   },
   
   title:{
    type:String,
    required: true
   },

   description:{
     type:String,
    required: true
   },

   duration:{
    type : Number, // ye apne ko cloudinary dega jb hum cloudinary mai pics videos upload krte hai to wo apne ko duration bhi dega
    required : true
   },

   views:{
    type :Number,
    default: 0
   },

   isPublished:{
    type: Boolean, // ki haa ye video publised hua ki ni yes or no
    default: true
   },

   owner : {
    type : Schema.Types.ObjectId,
    ref: "User"
   }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate) // now we can write aggregation queries regular querries also 
export const Video = mongoose.model("Video",videoSchema)