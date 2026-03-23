import {Router} from "express"
import { auth } from "../middleware/auth.middleware.js"
import { createCollection, deleteCollection, getAllCollection, openCollection } from "../controllers/collection.contoller.js"
let collectionRouter=Router()
collectionRouter.post("/save",auth,createCollection)
collectionRouter.get("/get-all-collection",auth,getAllCollection)
collectionRouter.get("/open/collection",auth,openCollection)
collectionRouter.delete("/delete/collection/:id",auth,deleteCollection)
export default collectionRouter