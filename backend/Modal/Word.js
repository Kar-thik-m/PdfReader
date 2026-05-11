import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    word: { type: String, required: true },
    meaning: mongoose.Schema.Types.Mixed, // The primary meaning object
    meanings: [mongoose.Schema.Types.Mixed], // All meaning objects
    phonetics: [mongoose.Schema.Types.Mixed], // All phonetic objects
    translation: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { timestamps: true, strict: false });

const Word = mongoose.model("Word", wordSchema);
export default Word;