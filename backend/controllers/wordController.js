import Word from "../Modal/Word.js";


/// Get Meaing

const getMeaning = async (req, res) => {
    try {
        const word = req.params.word;

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        const meaning = data[0]?.meanings?.[0];

        res.json({ word, meaning });

    } catch (err) {
        res.status(500).json({ error: "Meaning not found" });
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
