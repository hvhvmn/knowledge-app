import jwt from "jsonwebtoken";
export let auth=async (req,res,next) => {
    let token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Token not found"
        });
    }
    try {
        let decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized"
        });
    }
}