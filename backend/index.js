import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Db/Db.js";
import WordRouter from "./Route/wordRoutes.js";

dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/words", WordRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});