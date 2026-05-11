import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiTrash, HiRefresh, HiBookOpen, HiX, HiDownload } from "react-icons/hi";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import backendUrl from "../backendUrl";

const SavedWords = ({ refreshTrigger, onClose }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  {/* PDF Download Function */}
  const downloadPdf = async () => {
    if (words.length === 0) return;
    setPdfLoading(true);
    
    const element = document.createElement("div");
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.width = "800px";
    element.style.padding = "50px";
    element.style.backgroundColor = "white";
    element.style.color = "black";
    element.style.fontFamily = "'Inter', 'Arial', sans-serif";

    // Header
    const header = document.createElement("div");
    header.style.borderBottom = "2px solid #333";
    header.style.paddingBottom = "10px";
    header.style.marginBottom = "30px";
    
    const title = document.createElement("h1");
    title.innerText = "Saved Words Dictionary";
    title.style.fontSize = "32px";
    title.style.margin = "0";
    title.style.fontWeight = "bold";
    header.appendChild(title);
    element.appendChild(header);

    words.forEach((item, index) => {
      const entry = document.createElement("div");
      entry.style.marginBottom = "40px";
      entry.style.pageBreakInside = "avoid";

      // Word Title
      const wordHeader = document.createElement("h2");
      wordHeader.style.fontSize = "24px";
      wordHeader.style.fontWeight = "bold";
      wordHeader.style.margin = "0 0 10px 0";
      wordHeader.innerText = `${index + 1}.  ${item.word}`;
      entry.appendChild(wordHeader);

      // Tamil Translation
      if (item.translation && (Array.isArray(item.translation) ? item.translation.length > 0 : item.translation)) {
        const tamil = document.createElement("p");
        tamil.style.fontSize = "16px";
        tamil.style.margin = "5px 0";
        
        const label = document.createElement("span");
        label.innerText = "Tamil: ";
        label.style.fontWeight = "bold";
        tamil.appendChild(label);
        
        const text = document.createElement("span");
        text.innerText = Array.isArray(item.translation) ? item.translation.join(", ") : item.translation;
        tamil.appendChild(text);
        entry.appendChild(tamil);
      }

      // Meanings
      if (item.meanings && item.meanings.length > 0) {
        item.meanings.forEach(m => {
          const pos = document.createElement("p");
          pos.innerText = `(${m.partOfSpeech})`;
          pos.style.fontStyle = "italic";
          pos.style.margin = "10px 0 5px 0";
          pos.style.fontWeight = "600";
          entry.appendChild(pos);

          const list = document.createElement("ul");
          list.style.margin = "5px 0 10px 30px";
          list.style.padding = "0";
          
          m.definitions.slice(0, 2).forEach(def => {
            const li = document.createElement("li");
            li.style.marginBottom = "15px";
            li.style.listStyleType = "disc";
            
            const defText = document.createElement("p");
            defText.style.margin = "0";
            defText.style.fontSize = "15px";
            defText.innerText = def.definition || def;
            li.appendChild(defText);

            if (def.example) {
              const ex = document.createElement("p");
              ex.innerText = `"${def.example}"`;
              ex.style.color = "#444";
              ex.style.fontStyle = "italic";
              ex.style.margin = "5px 0 0 0";
              ex.style.fontSize = "14px";
              li.appendChild(ex);
            }
            list.appendChild(li);
          });
          entry.appendChild(list);
        });
      }

      const separator = document.createElement("div");
      separator.style.borderBottom = "1px solid #eee";
      separator.style.marginTop = "20px";
      entry.appendChild(separator);

      element.appendChild(entry);
    });

    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 800
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("saved-words-dictionary.pdf");
    } catch (err) {
      console.error("PDF Generation Error:", err);
    } finally {
      document.body.removeChild(element);
      setPdfLoading(false);
    }
  };

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

        <div className="flex items-center gap-2">
          <button
            onClick={downloadPdf}
            disabled={pdfLoading || words.length === 0}
            className={`p-2 rounded-lg transition-all ${pdfLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400'}`}
            title="Download Dictionary PDF"
          >
            {pdfLoading ? (
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <HiDownload size={20} />
            )}
          </button>
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
                <div className="flex flex-col gap-1">
                  <h4 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                    {item.word}
                    {item.translation && (Array.isArray(item.translation) ? item.translation.length > 0 : item.translation) && (
                      <span className="text-indigo-400 text-sm font-small bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 ml-2">
                        Tamil
                      </span>
                    )}
                  </h4>
                  {item.translation && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(Array.isArray(item.translation) ? item.translation : [item.translation]).map((t, i) => (
                        <span key={i} className="text-indigo-300 text-sm font-small leading-relaxed">
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
