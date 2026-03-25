import dotenv from "dotenv";
dotenv.config();

import server from "./src/app.js";
import db from "./src/config/db.js";

db();
server.listen(3000, ()=> {
    console.log('running in port 3000');
});