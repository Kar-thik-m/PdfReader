import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash, HiRefresh, HiBookOpen, HiX } from "react-icons/hi";
import backendUrl from "../backendUrl";

const SavedWords = ({ refreshTrigger, onClose }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/words/all`);
      setWords(response.data);
    } catch (err) {
      console.error("Failed to fetch words", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(words);
  useEffect(() => {
    fetchWords();
  }, [refreshTrigger]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-2xl border-l border-slate-800 w-full sm:w-80 lg:w-96 h-screen flex flex-col shadow-2xl overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all mr-1"
          >
            <HiX size={20} />
          </button>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <HiBookOpen className="text-indigo-400" />
            Saved Words
          </h3>
        </div>
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
              className="group bg-slate-800/40 border border-slate-700/50 p-4 rounded-3xl transition-all duration-300 hover:bg-slate-800/80 hover:border-indigo-500/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white capitalize">{item.word}</h4>
                  {item.translation && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(Array.isArray(item.translation) ? item.translation : [item.translation]).map((t, i) => (
                        <span key={i} className="text-indigo-400 text-[10px] font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {item.meanings && item.meanings.length > 0 ? (
                  item.meanings.map((m, mIdx) => (
                    <div key={mIdx} className="space-y-2 border-t border-slate-800/50 pt-3 first:border-0 first:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{m.partOfSpeech}</span>
                        <div className="h-px flex-1 bg-slate-800/50"></div>
                      </div>

                      <div className="space-y-2">
                        {m.definitions.slice(0, 2).map((def, dIdx) => (
                          <div key={dIdx} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/30">
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {def.definition || def}
                            </p>
                            {(def.example || (typeof def === 'object' && def.example)) && (
                              <p className="mt-1.5 text-xs text-slate-500 italic border-l border-slate-700 pl-2">
                                "{def.example || def.example}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {typeof item.meaning === 'object'
                      ? item.meaning?.definitions?.[0]?.definition
                      : item.meaning}
                  </p>
                )}
              </div>
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
