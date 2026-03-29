import fs from 'fs'
import path from 'path'
import { collectionModel } from "../models/collection.models.js";
import itemsModel from "../models/items.model.js";
import { generateTags, processItemForAI, embeddingService, vectorSearchService, getRelatedItems } from "../services/aiService.js";
import { addJobToQueue } from "../config/redis.js";
import { supabase, FileUploadService } from "../config/supabase.js";
import multer from 'multer';

export let saveItems=async (req,res) => {
   try {
    let {title,url,tags,type,notes}=req.body;

    console.log('📝 Creating item:', { title, url, type });

    // Get user-provided tags
    const userProvidedTags = Array.isArray(tags) ? tags : [];

    // Generate AI tags synchronously
    console.log('🏷️ Generating AI tags...');
    let aiTags = [];
    try {
        const tagText = `${title} ${notes || ''} ${url}`;
        aiTags = await generateTags(tagText);
        console.log(`✅ Generated ${aiTags.length} AI tags:`, aiTags);
    } catch (tagError) {
        console.warn('⚠️ Tag generation failed:', tagError.message);
        aiTags = [];
    }

    // Merge user-provided and AI-generated tags
    const mergedTags = [...new Set([...userProvidedTags, ...aiTags])];

    // Save the item with tags
    let item=await itemsModel.create({
        userId:req.user.id,
        title,
        url,
        tags: mergedTags,
        type,
        notes,
        processing: true  // Still processing for content extraction and embeddings
    });

    console.log('💾 Item created in DB:', item._id, 'with tags:', mergedTags);

    // Add job to Redis queue for background processing (content extraction, summary, embeddings)
    console.log('📤 Adding job to Redis queue for content processing...');
    const jobId = await addJobToQueue(
      item._id.toString(),
      title,
      url,
      notes,
      userProvidedTags
    );

    console.log("✅ Item saved with tags and queued for AI processing:", {
      itemId: item._id,
      jobId,
      tagsCount: mergedTags.length,
      status: "queued"
    });

    return res.status(201).json({
        message:"Item saved successfully with tags. Content processing started in background.",
        item:{
          ...item.toObject(),
          processing: true
        },
        jobId,
        processingMessage: "Tags generated. Content extraction, summary, and vector storage will be completed shortly..."
    })
   } catch (error) {
    console.error('❌ Error in saveItems:', error.message, error.stack);
    console.log(error);

    return res.status(500).json({
        message:"Internal server error"
    })
   }
}

export let uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.file;
        console.log('📁 File received:', {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        });

        // Upload to Supabase using FileUploadService
        const uploadResult = await FileUploadService.uploadFile(file);

        // Determine file type for database
        let itemType = 'File';
        if (file.mimetype === 'application/pdf') {
            itemType = 'Pdf';
        } else if (file.mimetype.startsWith('image/')) {
            itemType = 'Image';
        }

        // Parse tags from request
        const tagValues = req.body.tags ? JSON.parse(req.body.tags || '[]') : [];

        // Create item in database
        const itemUrl = req.body.url || uploadResult.url; // preserve original URL when sending via extension
        const item = await itemsModel.create({
            userId: req.user.id,
            title: req.body.title || file.originalname,
            url: itemUrl,
            tags: Array.isArray(tagValues) ? tagValues : [],
            type: itemType,
            notes: req.body.notes || '',
            processing: false, // Files don't need AI processing
            fileUrl: uploadResult.url, // Additional field for file URL
            filePath: uploadResult.path, // Supabase path for deletion
            fileSize: file.size,
            fileType: file.mimetype,
            aiProcessedAt: new Date()
        });

        console.log('✅ File item created:', item._id);

        return res.status(201).json({
            message: 'File uploaded successfully',
            item: {
                ...item.toObject(),
                fileUrl: uploadResult.url,
                fileSize: file.size,
                fileType: file.mimetype
            },
            uploadResult: {
                url: uploadResult.url,
                size: file.size,
                mimetype: file.mimetype
            }
        });
    } catch (error) {
        console.error('❌ uploadFile error:', error);
        // Don't crash the app, just return error response
        if (!res.headersSent) {
            return res.status(500).json({ 
                message: 'File upload failed', 
                error: error.message,
                details: error.details || 'Unknown error'
            });
        }
    }
};

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
        console.log(`🔍 getItemStatus called for item ${id} (user ${req.user?.id})`);

        // Validate ID format first
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: 'Invalid item id format'
            });
        }

        let item = await itemsModel.findOne({
            userId: req.user.id,
            _id: id
        });

        if (!item) {
            console.log(`⚠️ Item not found for given user (${req.user?.id}). Trying public id fallback...`);
            item = await itemsModel.findById(id);
        }

        if (!item) {
            console.warn(`❌ Item id ${id} not found in DB`);
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
            status: item.processing ? 'processing' : 'completed',
            userOwnsItem: item.userId.toString() === req.user.id.toString()
        });
    } catch (error) {
        console.error("Error getting item status:", error);
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

// Get resurfaced memory items
export let getResurfacedItems = async (req, res) => {
    try {
        const { MemoryResurfacingService } = await import('../services/memoryResurfacingService.js');

        const resurfacedItems = await MemoryResurfacingService.getResurfacedItems(req.user.id, 5);

        return res.status(200).json({
            message: "Resurfaced items retrieved",
            resurfacedItems: resurfacedItems,
            count: resurfacedItems.length
        });
    } catch (error) {
        console.log("Error getting resurfaced items:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Supabase upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow PDFs, images, and documents
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDFs, images, and documents are allowed.'), false);
        }
    }
});

// Export multer middleware for use in routes
export { upload };
