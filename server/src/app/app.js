import express from "express"
import complaintRoutes from "../routes/complaint.routes.js"
import cors from "cors";


const app = express();

app.use(express.json())


app.use(cors({
  origin: "https://your-frontend.vercel.app"
}));

app.use("/api/complaint", complaintRoutes)

app.get("/", (req, res) => {
    res.send("API is working properly")
})




export default app;