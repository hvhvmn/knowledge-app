import mongoose from "mongoose";
let itemsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
    ,
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true
    },
    url:{
        type:String,
        required:[true,"Url is required"],
        trim:true,
    },
    tags:{
        type:[String],
        default:[]
    },
    type:{
        type:String,
        required:[true,"Type is required"],
        enum:["article","video","tweet","image","pdf"]
    },
    notes:{
        type:String,
        trim:true
    }
},{timestamps:true})
let itemsModel=mongoose.model("items",itemsSchema)
export default itemsModel