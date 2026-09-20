import express from "express"
import complaintRoutes from "../routes/complaint.routes.js"
import cors from "cors";
import config from "../config/config.js";


const app = express();

app.use(express.json())


app.use(cors({
  origin: config.FRONTEND_URI,
  credentials: true
}));

app.use("/api/complaint", complaintRoutes)

app.get("/", (req, res) => {
    res.send("API is working properly")
})




export default app;