import {Router} from "express"
import { validateLogin, validateRegister } from "../validations/auth.validation.js"
import { getMe, login, regis } from "../controllers/auth.controllers.js"
import { auth } from "../middleware/auth.middleware.js"
let authRouter=Router()
authRouter.post("/register",validateRegister,regis)
authRouter.post("/login",validateLogin,login)
authRouter.get("/me",auth,getMe)
export default authRouter