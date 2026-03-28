import mongoose from "mongoose";
let itemsSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    collectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"collection",
        default:null
    },
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
    },
    fileUrl: {
        type:String,
        default:null
    },
    filePath: {
        type:String,
        default:null
    },
    fileSize: {
        type:Number,
        default:null
    },
    fileType: {
        type:String,
        default:null
    },
    content: {
        type:String,
        default:null
    },
    description: {
        type:String,
        default:null
    },
    extractedTitle: {
        type:String,
        default:null
    },
    contentExtractedAt: {
        type:Date,
        default:null
    },
    processing:{
        type:Boolean,
        default:true
    },
    processingError:{
        type:String,
        default:null
    },
    aiProcessedAt:{
        type:Date,
        default:null
    }
},{timestamps:true})
let itemsModel=mongoose.model("items",itemsSchema)
export default itemsModel