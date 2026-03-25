import { collectionModel } from "../models/collection.models.js";
import itemsModel from "../models/items.model.js";
import { generateTags, processItemForAI, embeddingService, vectorSearchService, getRelatedItems } from "../services/aiService.js";
export let saveItems=async (req,res) => {
   try {
    let {title,url,tags,type,notes}=req.body;

    // First save the item to get the ID
    let item=await itemsModel.create({
        userId:req.user.id,
        title,
        url,
        tags: [], // Will be updated after AI processing
        type,
        notes
    });

    // Process item with AI (tags + embeddings + vector storage)
    const aiResult = await processItemForAI(item._id, title, url, tags, notes);

    // Merge user tags with AI-generated tags
    const userProvidedTags = Array.isArray(tags) ? tags : [];
    const allTags = [...new Set([...userProvidedTags, ...aiResult.tags])];

    // Update item with final tags
    item.tags = allTags;
    await item.save();

    console.log("Item saved with AI processing:", {
      itemId: item._id,
      aiTags: aiResult.tags,
      vectorStored: aiResult.vectorStored
    });

    return res.status(201).json({
        message:"Item saved successfully with AI processing",
        item:item,
        aiProcessing: {
            tagsGenerated: aiResult.tags.length,
            vectorStored: aiResult.vectorStored
        }
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
export let getItemsByCollection=async (req,res) => {
    try {
        let {collectionId}=req.params
        let items=await itemsModel.find({
            userId:req.user.id,
            collectionId:collectionId
        })
        if(!items || items.length === 0){
            return res.status(200).json({
                message:"No items found in this collection",
                items:[]
            })
        }
        return res.status(200).json({
            message:"Items from collection",
            items:items
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
export let searchItems=async (req,res) => {
    try {
        let {q}=req.query

        if(!q || q.trim() === ""){
            return res.status(400).json({
                message:"Search query is required"
            })
        }

        let items = [];

        // Try vector similarity search first
        try {
            const queryEmbedding = await embeddingService(q);
            if (queryEmbedding) {
                const vectorResults = await vectorSearchService(queryEmbedding, 20);

                // Get item IDs from vector search results
                const itemIds = vectorResults.map(result => result.id);

                if (itemIds.length > 0) {
                    // Fetch full items from database
                    items = await itemsModel.find({
                        userId: req.user.id,
                        _id: { $in: itemIds }
                    });

                    // Sort items by vector similarity score
                    const scoreMap = new Map(vectorResults.map(r => [r.id, r.score]));
                    items.sort((a, b) => (scoreMap.get(b._id.toString()) || 0) - (scoreMap.get(a._id.toString()) || 0));

                    console.log(`Vector search found ${items.length} items for query: "${q}"`);
                }
            }
        } catch (vectorError) {
            console.log("Vector search failed, falling back to text search:", vectorError);
        }

        // Fallback to traditional text search if vector search didn't return results
        if (items.length === 0) {
            const searchRegex = new RegExp(q, 'i');

            items = await itemsModel.find({
                userId: req.user.id,
                $or: [
                    {title: searchRegex},
                    {notes: searchRegex},
                    {tags: searchRegex}
                ]
            });

            console.log(`Text search found ${items.length} items for query: "${q}"`);
        }

        return res.status(200).json({
            message: "Search results",
            items: items,
            searchType: items.length > 0 && items[0]?._id ? "vector" : "text"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export let getRelatedItemsController = async (req, res) => {
    try {
        const { id } = req.params;
        const limit = parseInt(req.query.limit) || 5;

        // Get related items from vector database
        const relatedVectors = await getRelatedItems(id, limit);

        if (relatedVectors.length === 0) {
            return res.status(200).json({
                message: "No related items found",
                relatedItems: []
            });
        }

        // Get item IDs from vector results
        const itemIds = relatedVectors.map(result => result.id);

        // Fetch full items from database
        const relatedItems = await itemsModel.find({
            userId: req.user.id,
            _id: { $in: itemIds }
        });

        // Sort by similarity score
        const scoreMap = new Map(relatedVectors.map(r => [r.id, r.score]));
        relatedItems.sort((a, b) => (scoreMap.get(b._id.toString()) || 0) - (scoreMap.get(a._id.toString()) || 0));

        return res.status(200).json({
            message: "Related items found",
            relatedItems: relatedItems
        });

    } catch (error) {
        console.log("Related items controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}