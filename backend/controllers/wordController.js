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
                meaning: data.meanings?.[0], // For backward compatibility
                meanings: data.meanings,
                phonetics: data.phonetics 
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
        const newWord = await Word.create(req.body);
        res.json(newWord);

    } catch (err) {
        res.status(500).json({ error: "Save failed" });
    }
};

// gET all words
const getWords = async (req, res) => {
    try {
        const words = await Word.find();
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
