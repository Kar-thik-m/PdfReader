import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { HiOutlineUpload, HiChevronLeft, HiChevronRight, HiZoomIn, HiZoomOut } from "react-icons/hi";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set worker URL for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFReader = ({ onWordClick }) => {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPageNumber(1);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };



    const changePage = (offset) => {
        setPageNumber((prevPageNumber) => Math.max(1, prevPageNumber + offset));
    };

    const handleTextClick = () => {
        const selection = window.getSelection();
        console.log("selection", selection);
        const selectedText = selection.toString().trim();
        if (selectedText && selectedText.split(/\s+/).length === 1) {
            // Only trigger if it's a single word
            onWordClick(selectedText);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
            {/* Header / Toolbar */}
            <div className="w-full max-w-5xl mb-8 flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl sticky top-4 z-10">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-500/20 font-medium">
                        <HiOutlineUpload className="text-xl" />
                        <span>Upload PDF</span>
                        <input type="file" onChange={onFileChange} accept=".pdf" className="hidden" />
                    </label>

                    {file && (
                        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                            <button
                                onClick={() => changePage(-1)}
                                disabled={pageNumber <= 1}
                                className="p-1 hover:text-indigo-400 disabled:opacity-30 transition-colors"
                            >
                                <HiChevronLeft size={24} />
                            </button>
                            <span className="text-sm font-medium min-w-[80px] text-center">
                                Page {pageNumber} of {numPages || '--'}
                            </span>
                            <button
                                onClick={() => changePage(1)}
                                disabled={pageNumber >= numPages}
                                className="p-1 hover:text-indigo-400 disabled:opacity-30 transition-colors"
                            >
                                <HiChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>

                {file && (
                    <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:text-indigo-400 transition-colors">
                            <HiZoomOut size={20} />
                        </button>
                        <span className="text-sm font-medium w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="p-1 hover:text-indigo-400 transition-colors">
                            <HiZoomIn size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div
                className="w-full flex-1 flex justify-center items-start overflow-auto custom-scrollbar"
                onMouseUp={handleTextClick}
            >
                {!file ? (
                    <div className="mt-20 flex flex-col items-center text-center max-w-md animate-fade-in">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20">
                            <HiOutlineUpload className="text-5xl text-indigo-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Welcome to AI PDF Reader
                        </h2>
                        <p className="text-slate-400 leading-relaxed">
                            Upload your PDF documents and click on any word to instantly get its meaning, synonyms, and examples.
                        </p>
                    </div>
                ) : (
                    <div className="relative group bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-800 ring-1 ring-slate-800/50 mb-12">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex flex-col items-center justify-center h-[600px] w-[500px]">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-slate-400 font-medium">Rendering PDF...</p>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderAnnotationLayer={true}
                                renderTextLayer={true}
                                className="shadow-inner"
                            />
                        </Document>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFReader;