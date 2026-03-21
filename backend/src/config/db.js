import mongoose from "mongoose";
let db=async () => {
    try {
        let res=await mongoose.connect(process.env.MONGODB_URI)
        if(res){
            console.log('Mongodb Connected');
            
        }
    } catch (error) {
        console.log('Error in connection with Mongodb');
    }
}
export default db