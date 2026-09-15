import mongoose from "mongoose"
import config from "./config.js";


async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Database connected sucessfully !")
    } catch (error) {
        
        console.log("Error while connecting to database")
    }
}

export default connectDB;