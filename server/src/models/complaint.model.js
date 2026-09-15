import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true 
    }, 
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const complaintModel = mongoose.model("complaints", complaintSchema)

export default complaintModel;