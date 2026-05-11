import Word from "../Modal/Word.js";
import axios from "axios";

/// Get Meaning
const getMeaning = async (req, res) => {
    try {
        const word = req.params.word;
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (response.data && response.data.length > 0) {
            const data = response.data[0];
            res.json({
                word,
                meaning: data.meaning,
                meanings: data.meanings,
                phonetics: data.phonetics,

            });
        } else {
            res.status(404).json({ error: "Meaning not found" });
        }

    } catch (err) {
        console.error("Dictionary API Error:", err.message);
        res.status(err.response?.status || 500).json({ error: "Meaning not found" });
    }
};


// Save word to DB
const saveWord = async (req, res) => {
    try {
        const { data } = req.body;
        if (!data || !data.word) {
            return res.status(400).json({ error: "Invalid data" });
        }

        console.log("Saving word data:", JSON.stringify(data, null, 2));

        // Upsert to avoid duplicates, saving the full structure
        const savedWord = await Word.findOneAndUpdate(
            { word: data.word.toLowerCase().trim() },
            {
                word: data.word,
                meaning: data.meaning || data.meanings?.[0],
                meanings: data.meanings,
                phonetics: data.phonetics,
                translation: data.translation || [],
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log("Word saved successfully:", savedWord.word);
        res.json(savedWord);

    } catch (err) {
        console.error("Save error:", err);
        res.status(500).json({ error: "Save failed" });
    }
};

// gET all words
const getWords = async (req, res) => {
    try {
        const words = await Word.find().sort({ createdAt: -1 });
        res.json(words);
    } catch (err) {
        res.status(500).json({ error: "Get failed" });
    }
};

export {
    getMeaning,
    saveWord,
    getWords
};
