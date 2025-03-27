import mongoose from "mongoose";

const connecttoDatabase = async () => {
    try{
         await mongoose.connect(process.env.MONGODB_URL)
         console.log("Database Connected")
    }catch(error) {
        console.log(error)
    }
}
 
export default connecttoDatabase