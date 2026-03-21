import mongoose from "mongoose";
import bcrypt from "bcryptjs";
let userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
        select:false
    }
},{timestamps:true})
userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,10);
});
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
};
let userModel=mongoose.model("user",userSchema)
export default userModel