import { collectionModel } from "../models/collection.models.js";
import itemsModel from "../models/items.model.js";
export let saveItems=async (req,res) => {
   try {
    let {title,url,tags,type,notes,collectionName}=req.body;
    let item=await itemsModel.create({
        userId:req.user.id,
        collectionName,
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
        let {collectionName}=req.body;
        let itemId=req.params.id;
        let isCollection=await collectionModel.findOne({
            collectionName
        })
        if(!isCollection){
            return res.status(404).json({
                message:"Collection not found"
            })
        }
        let collection=await itemsModel.findOneAndUpdate({
          userId:req.user.id,
          _id:itemId
        },{
              collectionName:collectionName
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