import mongoose from "mongoose";

let resurfacedItemsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items",
        required: true
    },
    resurfacedAt: {
        type: Date,
        default: Date.now
    },
    daysOld: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        enum: ["random", "interest_based", "tag_similarity", "vector_similarity"],
        default: "random"
    }
}, { timestamps: true });

// Index for efficient queries
resurfacedItemsSchema.index({ userId: 1, resurfacedAt: -1 });
resurfacedItemsSchema.index({ userId: 1, itemId: 1 }, { unique: true }); // Prevent duplicate resurfacing

let resurfacedItemsModel = mongoose.model("resurfaced_items", resurfacedItemsSchema);
export default resurfacedItemsModel;