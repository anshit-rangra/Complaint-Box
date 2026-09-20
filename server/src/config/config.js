import dotenv from "dotenv";

dotenv.config();

const config = {

    MONGO_URI: process.env.MONGODB_URI,
    FRONTEND_URI: process.env.FRONTEND_URI
    
}

export default config;