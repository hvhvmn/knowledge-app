import {Router} from "express"
import { getItems, getOneItem, saveItems } from "../controllers/items.controller.js"
import { validateItems } from "../validations/items.validation.js"
let itemRouter=Router()
itemRouter.post("/save",validateItems,saveItems)
itemRouter.get("/all-items",getItems)
itemRouter.get("/get-one/:id",getOneItem)
export default itemRouter