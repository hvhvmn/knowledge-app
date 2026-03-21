import server from "./src/app.js";
import dotenv from "dotenv"
import { config } from "dotenv";
import db from "./src/config/db.js";
dotenv.config()
db()
server.listen(3000,()=>{
    console.log('running in port 3000');  
})