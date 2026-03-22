import mongoose from "mongoose"
let collectionSchema=new mongoose.Schema({
    collectionName:{
        type:String,
        required:[true,"Collection name is required"],
        default:null
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{
    timestamps:true
})
export let collectionModel=mongoose.model("collection",collectionSchema)