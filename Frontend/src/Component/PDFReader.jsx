import React, { useState, useRef, useEffect } from "react";
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
    const [scale, setScale] = useState(1.0);
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Subtract padding and borders
                setContainerWidth(containerRef.current.clientWidth - 32);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

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
        setPageNumber((prev) => {
            const next = (Number(prev) || 1) + offset;
            return Math.min(numPages || next, Math.max(1, next));
        });
    };

    const handleTextClick = (e) => {
        let text = "";
        const selection = window.getSelection();
        if (selection) {
            text = selection.toString().trim();
            if (text && text.split(/\s+/).length === 1) {
                onWordClick(text);
            }
        } else if (e.target?.textContent) {
            text = e.target.textContent.trim();
            console.log("Clicked on", text);
        }



    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
            {/* Header / Toolbar */}
            <div className="w-full max-w-5xl mb-6 md:mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/50 p-3 md:p-4 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl sticky top-4 z-10">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 w-full md:w-auto">
                    <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-500/20 font-medium">
                        <HiOutlineUpload className="text-xl" />
                        <span>Upload PDF</span>
                        <input type="file" onChange={onFileChange} accept=".pdf" className="hidden" />
                    </label>

                    {file && (
                        <>
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

                            <input
                                type="number"
                                min={1}
                                max={numPages}
                                value={pageNumber}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setPageNumber("");
                                        return;
                                    }
                                    const num = parseInt(val);
                                    if (!isNaN(num)) {
                                        setPageNumber(Math.min(numPages, Math.max(1, num)));
                                    }
                                }}
                                className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 w-20 text-center"
                            />
                        </>
                    )}
                </div>

                {file && (
                    <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 mx-auto md:mx-0">
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
                ref={containerRef}
                className="w-full flex-1 flex justify-center items-start overflow-auto custom-scrollbar px-2 md:px-0"

                onPointerUp={() => handleTextClick()}
            >
                {!file ? (
                    <div className="mt-10 md:mt-20 flex flex-col items-center text-center max-w-md animate-fade-in px-4">
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
                                <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
                                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-4 text-slate-400 font-medium">Rendering PDF...</p>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={Number(pageNumber) || 1}
                                scale={scale}
                                width={containerWidth ? Math.min(containerWidth, 800 * scale) : 800}
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