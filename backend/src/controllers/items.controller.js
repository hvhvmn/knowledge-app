import { collectionModel } from "../models/collection.models.js";
import itemsModel from "../models/items.model.js";
export let saveItems=async (req,res) => {
   try {
    let {title,url,tags,type,notes}=req.body;
    let item=await itemsModel.create({
        userId:req.user.id,
        title,
        url,
        tags,
        type,
        notes
    })
    return res.status(201).json({
        message:"An is item is added",
        item:item
    })
   } catch (error) {    
    console.log(error);
    
    return res.status(500).json({
        message:"Internal server error"
    })
   }
}
export let getItems=async (req,res) => {
    try {
        let allItems=await itemsModel.find({
            userId:req.user.id
        })
    if(!allItems){
        return res.status(404).json({
            message:"Items not found"
        })
    }

    return res.status(200).json({
        message:"All items",
        items:allItems
    })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let getOneItem=async (req,res) => {
    try {
        let pr=req.params.id
        let item=await itemsModel.find({
            userId:req.user.id,
            _id:pr
        })
        if(!item){
            return res.status(404).json({
                message:"Item not found"
            })
        }


        return res.status(200).json({
            message:"Your requested item founded successfully",
            item:item
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let addItemInCollection=async (req,res) => {
    try {
        let {id}=req.params;
        let {iId}=req.params
        let isCollection=await collectionModel.findOne({
            _id:id
        })
        if(!isCollection){
            return res.status(404).json({
                message:"Collection not found"
            })
        }
        let collection=await itemsModel.findOneAndUpdate({
          userId:req.user.id,
          _id:iId
        },{
              collectionId:id
        })
        return res.status(200).json({
            message:"Item is added to the collection",
            collection
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let deleteAnItem=async (req,res) => {
    try {
        let {id}=req.params
        let isItem=await itemsModel.findOne({
            userId:req.user.id,
            _id:id
        })
        if(!isItem){
            return res.status(404).json({
                message:"Item not found"
            })
        }
        await itemsModel.findByIdAndDelete(id)
        return res.status(200).json({
            message:"Item deleted"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}