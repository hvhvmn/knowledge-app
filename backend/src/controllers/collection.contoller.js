import { collectionModel } from "../models/collection.models.js"
import itemsModel from "../models/items.model.js"

export let createCollection=async (req,res) => {
    try {
        let {collectionName}=req.body
        if(!collectionName){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
     let collection=collectionModel.create({
        collectionName,
        userId:req.user.id
     })  
     return res.status(201).json({
        message:"Collection created",
        collectionName
     }) 
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let getAllCollection=async (req,res) => {
    try {
        let collections=await collectionModel.find({
            userId:req.user.id
        })
        return res.status(200).json({
            message:"All collections",
            collections
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let openCollection=async (req,res) => {
    try {
        let {collectionName}=req.body
        if(!collectionName){
            return res.status(400).json({
                message:"Collection name is required"
            })
        }
        let isCollection=await collectionModel.findOne({
            collectionName:collectionName
        })
        if(!isCollection){
            return res.status(404).json({
                message:"Collection not found"
            })
        }
        let open=await itemsModel.find({
            userId:req.user.id,
            collectionName:collectionName
        })
        return res.status(200).json({
            message:"All items in collection",
            items:open
        })
    } catch (error) {        
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}