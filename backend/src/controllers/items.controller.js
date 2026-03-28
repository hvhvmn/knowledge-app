import { collectionModel } from "../models/collection.models.js";
import itemsModel from "../models/items.model.js";
import { generateTags, processItemForAI, embeddingService, vectorSearchService, getRelatedItems } from "../services/aiService.js";
import { addJobToQueue } from "../config/redis.js";

export let saveItems=async (req,res) => {
   try {
    let {title,url,tags,type,notes}=req.body;

    console.log('📝 Creating item:', { title, url, type });

    // Save the item with processing flag set to true
    let item=await itemsModel.create({
        userId:req.user.id,
        title,
        url,
        tags: [], // Will be updated after AI processing
        type,
        notes,
        processing: true  // Mark as processing
    });

    console.log('💾 Item created in DB:', item._id);

    // Get user-provided tags
    const userProvidedTags = Array.isArray(tags) ? tags : [];

    // Add job to Redis queue for background processing
    console.log('📤 Adding job to Redis queue...');
    const jobId = await addJobToQueue(
      item._id.toString(),
      title,
      url,
      notes,
      userProvidedTags
    );

    console.log("✅ Item saved and queued for AI processing:", {
      itemId: item._id,
      jobId,
      status: "queued"
    });

    return res.status(201).json({
        message:"Item saved successfully. AI processing started in background.",
        item:{
          ...item.toObject(),
          processing: true
        },
        jobId,
        processingMessage: "Tags, embeddings, and vector storage will be completed shortly..."
    })
   } catch (error) {
    console.error('❌ Error in saveItems:', error.message, error.stack);
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
        const pr = req.params.id;
        const item = await itemsModel.findOne({
            userId: req.user.id,
            _id: pr
        });

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        return res.status(200).json({
            message: "Your requested item found successfully",
            item: item
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        });
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
        }, { returnDocument: 'after' })
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

// Get processing status of an item
export let getItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await itemsModel.findOne({
            userId: req.user.id,
            _id: id
        });

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        return res.status(200).json({
            message: "Item status retrieved",
            itemId: item._id,
            processing: item.processing,
            processingError: item.processingError,
            aiProcessedAt: item.aiProcessedAt,
            tags: item.tags,
            status: item.processing ? 'processing' : 'completed'
        });
    } catch (error) {
        console.log("Error getting item status:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Diagnostic endpoint to check queue status
export let getQueueStatus = async (req, res) => {
    try {
        const { getRedis } = await import('../config/redis.js');
        const redis = getRedis();
        
        // Get queue length
        const queueLength = await redis.llen('ai-processing:queue');
        
        // Get processing items count
        const processingCount = await itemsModel.countDocuments({
            userId: req.user.id,
            processing: true
        });
        
        // Check Redis connection
        const redisInfo = await redis.ping();
        
        return res.status(200).json({
            message: "Queue status",
            queue: {
                length: queueLength,
                name: 'ai-processing:queue'
            },
            database: {
                processingItemsCount: processingCount
            },
            redis: {
                connected: redisInfo === 'PONG'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log("Error getting queue status:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
