import { Router } from "express";
import { addItemInCollection, deleteAnItem, getItems, getOneItem, saveItems, getItemsByCollection, searchItems, getRelatedItemsController, getItemStatus, getQueueStatus, getResurfacedItems, uploadFile, upload } from "../controllers/items.controller.js";
import { getJobStatus } from "../config/redis.js";
import { validateItems } from "../validations/items.validation.js";
import { auth } from "../middleware/auth.middleware.js";

let itemRouter = Router();
itemRouter.post("/save", validateItems, auth, saveItems);
itemRouter.post("/upload", auth, upload.single('file'), uploadFile);
itemRouter.get("/all-items", auth, getItems);
itemRouter.get("/search", auth, searchItems);

itemRouter.get("/status/:id", auth, async (req, res) => {
  try {
    const jobId = `item-${req.params.id}`;
    const status = await getJobStatus(jobId);

    return res.status(200).json({
      success: true,
      status: status || { status: 'not found', progress: 0 }
    });
  } catch (error) {
    console.error("Status error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking status"
    });
  }
});

itemRouter.get("/queue-status", auth, getQueueStatus);
itemRouter.get("/related/:id", auth, getRelatedItemsController);
itemRouter.get("/resurface", auth, getResurfacedItems);
itemRouter.get("/get-one/:id", auth, getOneItem);
itemRouter.get("/collection/:collectionId", auth, getItemsByCollection);
itemRouter.put("/update/item/collection/:iId/:id", auth, addItemInCollection);
itemRouter.delete("/delete/item/:id", auth, deleteAnItem);

export default itemRouter;