import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    word: String,
    meaning: String
});

const Word = mongoose.model("Word", wordSchema);
export default Word;