import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true },
    meanings: [
        {
            partOfSpeech: String,
            definitions: [String]
        }
    ],
    meaning: String // Summary or first definition
}, { timestamps: true });

const Word = mongoose.model("Word", wordSchema);
export default Word;