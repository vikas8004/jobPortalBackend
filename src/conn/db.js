import mongoose  from "mongoose";

const connectDb=async()=>{
    try {
        let conn=await mongoose.connect(process.env.URI);
        return conn
    } catch (error) {
        throw new Error(error.message)
    }

}

export default connectDb;