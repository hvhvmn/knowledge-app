import {Router} from "express"
import { addItemInCollection, getItems, getOneItem, saveItems } from "../controllers/items.controller.js"
import { validateItems } from "../validations/items.validation.js"
import { auth } from "../middleware/auth.middleware.js"
let itemRouter=Router()
itemRouter.post("/save",validateItems,auth,saveItems)
itemRouter.get("/all-items",auth,getItems)
itemRouter.get("/get-one/:id",auth,getOneItem)
itemRouter.put("/update/item/collection/:id",auth,addItemInCollection)
export default itemRouter