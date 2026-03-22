import {Router} from "express"
import { auth } from "../middleware/auth.middleware.js"
import { createCollection, getAllCollection, openCollection } from "../controllers/collection.contoller.js"
let collectionRouter=Router()
collectionRouter.post("/save",auth,createCollection)
collectionRouter.get("/get-all-collection",auth,getAllCollection)
collectionRouter.get("/open/collection",auth,openCollection)

export default collectionRouter