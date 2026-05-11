import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import WordRouter from "./Route/wordRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* -------------------- CORS -------------------- */
app.use(cors({
    origin: ["http://localhost:5173", "https://pdfreaders.netlify.app/", "https://6a0088e905855c8dd769050d--pdfreaders.netlify.app/"], // Add your deployed frontend URL here
    credentials: true
}));

/* -------------------- Middleware -------------------- */
app.use(express.json());

/* -------------------- Root Route -------------------- */
app.get("/", (req, res) => {
    res.send("API is running...");
});

/* -------------------- Routes -------------------- */
app.use("/api/words", WordRouter);

/* -------------------- MongoDB Connection -------------------- */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

/* -------------------- Start Server -------------------- */
const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.log("Server Error:", error.message);
    }
};

startServer();