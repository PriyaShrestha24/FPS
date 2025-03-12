import mongoose from "mongoose";

const connecttoDatabase = async () => {
    try{
         await mongoose.connect(process.env.MONGODB_URL)
    }catch(error) {
        console.log(error)
    }
}
 
export default connecttoDatabase