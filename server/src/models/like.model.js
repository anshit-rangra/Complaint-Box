import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    complaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "complaints"
    },
    user: {
        type: String,
        required: true
    }
})

const likeModel =  mongoose.model("likes", likeSchema)

export default likeModel;