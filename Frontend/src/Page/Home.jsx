import React, { useState } from "react";
import PDFReader from "../Component/PDFReader";
import WordPopup from "../Component/WordPopup";
import SavedWords from "../Component/SavedWords";
import { HiBookOpen, HiX } from "react-icons/hi";

const Home = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [showSavedWords, setShowSavedWords] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWordClick = (word) => {
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (cleanWord.length > 1) {
      setSelectedWord(cleanWord);
    }
  };

  const closePopup = () => {
    setSelectedWord(null);
  };

  const onWordSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex overflow-hidden">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-500 ${showSavedWords ? 'mr-0' : 'mr-0'}`}>
        <PDFReader onWordClick={handleWordClick} />
      </div>

      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setShowSavedWords(!showSavedWords)}
        className="fixed bottom-8 right-8 z-30 w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 transition-all active:scale-90 group"
      >
        {showSavedWords ? <HiX size={28} /> : <HiBookOpen size={28} />}
        {!showSavedWords && (
            <span className="absolute right-20 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-800 shadow-xl pointer-events-none">
                View Saved Words
            </span>
        )}
      </button>

      {/* Saved Words Sidebar */}
      {showSavedWords && (
        <div className="z-20 border-l border-slate-800">
          <SavedWords refreshTrigger={refreshTrigger} />
        </div>
      )}
      
      {selectedWord && (
        <WordPopup 
          word={selectedWord} 
          onClose={closePopup} 
          onSaveSuccess={onWordSaved}
        />
      )}
    </div>
  );
};

export default Home;