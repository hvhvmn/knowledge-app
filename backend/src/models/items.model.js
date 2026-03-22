import mongoose from "mongoose";
let itemsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    collectionName:{
        type:String,
        default:null
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
        enum:["Article","Video","Tweet","Image","Pdf"]
    },
    notes:{
        type:String,
        trim:true
    }
},{timestamps:true})
let itemsModel=mongoose.model("items",itemsSchema)
export default itemsModel