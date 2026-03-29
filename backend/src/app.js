import express from "express"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import itemRouter from "./routes/items.routes.js"
import morgan from "morgan"
import cors from "cors"
import collectionRouter from "./routes/collection.routes.js"
import graphRouter from "./routes/graph.routes.js"
let server=express()
server.use(express.json())
server.use(cookieParser())
server.use(morgan("dev"))
server.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ["https://knowledge-app-40by.onrender.com", "https://knowledge-app-frontend.onrender.com", "https://knowledge-app.onrender.com"]
        : "http://localhost:5173",
    credentials:true
}))
server.use(express.static("./public"))
server.use("/api/auth",authRouter)
server.use("/api/items",itemRouter)
server.use("/api/collection",collectionRouter)
server.use("/api/graph",graphRouter)
export default server