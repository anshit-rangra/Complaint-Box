import complaintModel from "../models/complaint.model.js"
import { v4 as uuidv4 } from 'uuid';
import likeModel from "../models/like.model.js"


async function postComplaint(req, res) {
    try {
        const { title, description } = req.body || {};

        // Validate request
        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        // Create complaint
        const complaint = await complaintModel.create({
            title: title.trim(),
            description: description.trim()
        });

        // Send response
        return res.status(201).json({
            message: "Complaint added successfully",
            complaint
        });

    } catch (error) {
        console.error("Error while creating complaint:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function likeComplaint(req, res) {

    
    try {
        const { complaintId }  = req.params || {};
        const token = req.headers?.token;
        
        
        if(!token) return res.status(404).json({message:"Token not found !"})
        
    
    const [likeInstance, complaintInstance] = await Promise.all([ likeModel.findOne({ 
    user: token, 
    complaint: complaintId 
    }),  
    complaintModel.findOne({ _id : complaintId })])

    if (!complaintInstance) {
    return res.status(404).json({
        message: "Complaint not found"
    });
}

    let message = ""

    if(likeInstance) {

        complaintInstance.likes = complaintInstance.likes - 1
        await Promise.all([ likeInstance.deleteOne(), complaintInstance.save() ])
        message = "remove"
    } else {

        complaintInstance.likes = complaintInstance.likes + 1
        await Promise.all([likeModel.create({ user: token , complaint: complaintId }), complaintInstance.save() ])
        message  = "added"

    }

    res.status(201).json({message: `Like ${message} sucessfully`, cmd: message})

    } catch (error) {
        console.error("Error is = ", error)
        res.status(500).json({message: "Internal server error"})
    }

}

async function getId(req, res) {

    const id = uuidv4();

    res.json({message: "Id created sucessfully", token: id})

}

async function getComplaints(req, res) {

    let { limit=10 , page=1 } = req.query;
    limit = Number(limit)
    page = Number(page)
    let skip = ( page - 1) * limit
    
    try {
        
        const [ complaints, totalComplaints ] = await Promise.all([complaintModel.find().sort({likes: -1}).skip(skip).limit(limit),
        complaintModel.countDocuments()]);

        res.status(200).json({message: "Complaints fetch sucessfully", data: {
            complaints , total: totalComplaints, page
        } })

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }


}

async function deleteComplaint(req, res) {
    const { id } = req.params;

    try {
        await complaintModel.deleteOne({ _id : id })
        res.status(200).json({message: "Complaint deleted sucessfully"})
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }

}

export default { postComplaint, likeComplaint, getId, getComplaints, deleteComplaint }