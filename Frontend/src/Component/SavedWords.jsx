import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash, HiRefresh, HiBookOpen } from "react-icons/hi";

const SavedWords = ({ refreshTrigger }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/words/all");
      setWords(response.data);
    } catch (err) {
      console.error("Failed to fetch words", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [refreshTrigger]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border-l border-slate-800 w-80 h-screen flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HiBookOpen className="text-indigo-400" />
          Saved Words
        </h3>
        <button 
          onClick={fetchWords}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"
          title="Refresh list"
        >
          <HiRefresh className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {loading && words.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Loading your library...</p>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-slate-500 text-sm">No words saved yet. Click on words in your PDF to save them!</p>
          </div>
        ) : (
          words.map((item) => (
            <div 
              key={item._id} 
              className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 p-4 rounded-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-indigo-300 capitalize">{item.word}</h4>
                {/* Delete functionality could be added here */}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                {item.meaning}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <p className="text-xs text-center text-slate-500">
          {words.length} words in your personal dictionary
        </p>
      </div>
    </div>
  );
};

export default SavedWords;
