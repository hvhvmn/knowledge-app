import {Router} from "express"
import { addItemInCollection, deleteAnItem,  getItems, getOneItem, saveItems, getItemsByCollection, searchItems, getRelatedItemsController, getItemStatus, getQueueStatus, getResurfacedItems, uploadFile, upload } from "../controllers/items.controller.js"
import { validateItems } from "../validations/items.validation.js"
import { auth } from "../middleware/auth.middleware.js"
let itemRouter=Router()
itemRouter.post("/save",validateItems,auth,saveItems)
itemRouter.post("/upload", auth, upload.single('file'), uploadFile)
itemRouter.get("/all-items",auth,getItems)
itemRouter.get("/search",auth,searchItems)
itemRouter.get("/status/:id",auth,getItemStatus)
itemRouter.get("/queue-status",auth,getQueueStatus)
itemRouter.get("/related/:id",auth,getRelatedItemsController)
itemRouter.get("/resurface",auth,getResurfacedItems)
itemRouter.get("/get-one/:id",auth,getOneItem)
itemRouter.get("/collection/:collectionId",auth,getItemsByCollection)
itemRouter.put("/update/item/collection/:iId/:id",auth,addItemInCollection)
itemRouter.delete("/delete/item/:id",auth,deleteAnItem)
export default itemRouter