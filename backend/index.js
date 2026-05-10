import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Db/Db.js";
import WordRouter from "./Route/wordRoutes.js";

dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/words", WordRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});