import express from "express"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import itemRouter from "./routes/items.routes.js"
import morgan from "morgan"
import cors from "cors"
import collectionRouter from "./routes/collection.routes.js"
let server=express()
server.use(express.json())
server.use(cookieParser())
server.use(morgan("dev"))
server.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
server.use("/api/auth",authRouter)
server.use("/api/items",itemRouter)
server.use("/api/collection",collectionRouter)
export default server