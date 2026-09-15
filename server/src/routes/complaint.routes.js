import express from "express"
import complaintsController from "../controllers/complaints.controller.js";

const router = express.Router();

router.post("/post", complaintsController.postComplaint)

router.post("/like/:complaintId", complaintsController.likeComplaint)

router.get("/id", complaintsController.getId)

router.get("/get", complaintsController.getComplaints)

router.delete("/delete/:id", complaintsController.deleteComplaint)

export default router;