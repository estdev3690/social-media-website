import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
 },
text:{
    type:String,
},
image:{
    type:String,
},
likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
}],
comments:[{
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
 },
 text:{
    type:String,
    required:true,
 }
}],

},{timestamps:true});

const postModel=mongoose.models.Post||mongoose.model("Post",postSchema);
export default postModel;