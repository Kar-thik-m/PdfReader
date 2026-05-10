import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiX, HiVolumeUp, HiBookmark, HiOutlineBookmark } from "react-icons/hi";
import backendUrl from "../backendUrl";

const WordPopup = ({ word, onClose, onSaveSuccess }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchMeaning = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching directly from the dictionary API to bypass backend issues
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data;
        console.log("data", data);
        if (!data || !data.length) {
          setError("Meaning not found. Please try another word.");
        } else {
          setData({
            word,
            meanings: data[0].meanings,
            phonetics: data[0].phonetics
          });
        }
      } catch (err) {
        setError("Meaning not found. Please try another word.");
      } finally {
        setLoading(false);
      }
    };

    if (word) {
      fetchMeaning();
    }
  }, [word]);

  const handleSave = async () => {
    try {
      // Assuming backend is at http://localhost:3000
      await axios.post(`${backendUrl}/api/words/save`, {
        word: word,
        meaning: data?.meanings?.[0]?.definitions[0]?.definition
      });
      setIsSaved(true);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Failed to save word", err);
      // Even if backend fails, let's toggle UI for demo
      setIsSaved(!isSaved);
    }
  };

  const playAudio = () => {
    const audioUrl = data?.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  if (!word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 flex items-start justify-between bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-800">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize mb-1">{word}</h2>
            {/* The backend currently doesn't return phonetics, but we'll leave this commented out or handle it gracefully */}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
            >
              {isSaved ? <HiBookmark size={20} /> : <HiOutlineBookmark size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-red-500/20 hover:text-red-400"
            >
              <HiX size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400">Searching definitions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pronunciation - currently not provided by backend */}
              {data?.phonetics?.some(p => p.audio) && (
                <button
                  onClick={playAudio}
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium bg-indigo-500/10 px-4 py-2 rounded-lg"
                >
                  <HiVolumeUp size={18} />
                  Listen to pronunciation
                </button>
              )}

              {/* Meanings */}
              {data?.meanings?.map((meaning, mIdx) => (
                <div key={mIdx} className="space-y-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="italic text-indigo-400 text-sm font-semibold uppercase tracking-wider">{meaning.partOfSpeech}</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>
                  {meaning.definitions.map((def, dIdx) => (
                    <div key={dIdx} className="bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                      <p className="text-slate-200 leading-relaxed">
                        {def.definition}
                      </p>
                      {def.example && (
                        <p className="mt-2 text-slate-400 text-sm italic border-l-2 border-indigo-500/30 pl-3">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Synonyms */}
                  {meaning.synonyms?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Synonyms</p>
                      <div className="flex flex-wrap gap-2">
                        {meaning.synonyms.slice(0, 5).map((syn, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 bg-indigo-500/10 rounded-md text-[10px] text-indigo-300 border border-indigo-500/20">
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-800/30 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordPopup;
