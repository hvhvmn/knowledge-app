import userModel from "../models/user.models.js";
import jwt from "jsonwebtoken";
export let regis=async (req,res) => {
     let {username,email,password}=req.body;
     let isUser=await userModel.findOne({
        $or:[
            {
                username:username
            },
            {
                email:email
            }
        ]
     });
     if(isUser){
        return res.status(409).json({
            message:"User already exists with this username or email"
        });
     }
     let user=await userModel.create({
        username:username,
        email:email,
        password:password
     })
     let token=jwt.sign({
        id:user._id
     },process.env.JWT_SECRET,{
        expiresIn:"1d"
     });
     res.cookie("token",token)
     return res.status(201).json({
        message:"User created successfully",
        user:{
            username:user.username,
            email:user.email
        }
    });
}
export let login=async (req,res) => {
    let {email,password}=req.body;
    let user=await userModel.findOne({email:email}).select("+password");
    if(!user){
        return res.status(401).json({
            message:"Unauthorized "
        });
    }
    let isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({
            message:"Invalid credentials"
        });
    }
    let token=jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{
        expiresIn:"1d"
    });
    res.cookie("token",token)
    return res.status(200).json({
        message:"Login successfully",
        user:{
            username:user.username,
            email:user.email
        }
    });
}
export let getMe=async (req,res) => {
    let user=req.user;
    let userData=await userModel.findById(user.id)
    return res.status(200).json({
        message:"User fetched successfully",
        user:{
            username:userData.username,
            email:userData.email
        }
    });
}
export let logout=async (req,res) => {
    try {
     let token=req.cookies.token;
        if(!token){
            return res.status(400).json({
                message:"Token not found"
            });
        }
        res.clearCookie("token");
        return res.status(200).json({
            message:"Logout successfully"
        });   
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}   