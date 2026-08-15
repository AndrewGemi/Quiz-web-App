import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseExcelFile, downloadExcelTemplate } from "../utils/excelHelper";

export default function ExcelUploadModal({ isOpen, onClose, onImportSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedResult, setParsedResult] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  function resetState() {
    setError(null);
    setParsedResult(null);
    setUploadedFileName("");
    setIsLoading(false);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  async function handleFile(file) {
    if (!file) return;
    setError(null);
    setIsLoading(true);
    setUploadedFileName(file.name);

    try {
      const result = await parseExcelFile(file);
      setParsedResult(result);
    } catch (err) {
      setError(err.message || "Failed to process Excel file.");
      setParsedResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleConfirm() {
    if (parsedResult && parsedResult.categories?.length) {
      onImportSuccess(parsedResult.categories, parsedResult);
      handleClose();
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl glass-card bg-white/98 dark:bg-[#120826]/98 border-2 border-purple-200/90 dark:border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-purple-100 dark:border-purple-500/20">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white bg-purple-600 border border-purple-500 mb-2 shadow-sm">
                Custom Question Importer
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📊</span>
                <span>Import from Excel / Spreadsheet</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1 font-medium">
                Upload your questions spreadsheet (<code className="px-1.5 py-0.5 rounded bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-300 text-xs font-mono font-bold">.xlsx</code>, <code className="px-1.5 py-0.5 rounded bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-300 text-xs font-mono font-bold">.xls</code>, <code className="px-1.5 py-0.5 rounded bg-purple-100/70 dark:bg-purple-950/50 text-purple-900 dark:text-purple-300 text-xs font-mono font-bold">.csv</code>) to create a custom tournament.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-lg transition-colors shrink-0"
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Template Download Callout */}
          <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border border-purple-200 dark:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📋</span>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  Need the Excel Template?
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
                  Download our formatted template with bilingual columns and ready-to-use sample questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={downloadExcelTemplate}
              className="btn-secondary whitespace-nowrap text-sm px-4 py-2.5 rounded-xl border border-purple-300 dark:border-purple-400/40 text-purple-900 dark:text-purple-200 bg-white dark:bg-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/30 flex items-center gap-2 font-black shrink-0 shadow-sm"
            >
              <span>📥</span>
              <span>Download Excel Template</span>
            </button>
          </div>

          {/* Drag & Drop Upload Zone (when not previewing) */}
          {!parsedResult && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 scale-[1.01]"
                  : "border-purple-300 dark:border-purple-500/30 hover:border-violet-500 bg-slate-50/70 dark:bg-white/[0.02] hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-violet-500/30 mb-2 animate-bounce">
                📁
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-800 dark:text-slate-200 font-extrabold text-base">
                    Extracting questions from <span className="text-violet-600 dark:text-violet-400 font-black">{uploadedFileName}</span>...
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Drop your spreadsheet here, or <span className="text-gradient-purple underline">browse files</span>
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold max-w-md">
                    Supports Microsoft Excel (<code className="font-mono">.xlsx, .xls</code>) and CSV (<code className="font-mono">.csv</code>) files.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 text-rose-900 dark:text-rose-200 flex items-start gap-3 text-sm font-medium"
            >
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="font-extrabold text-rose-950 dark:text-rose-100">Upload Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Parsed Result & Category Preview */}
          {parsedResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 mt-2"
            >
              {/* Summary Stats Badge Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✅</span>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base">
                      {uploadedFileName || "Spreadsheet"} Loaded Successfully!
                    </h4>
                    <p className="text-emerald-900 dark:text-emerald-300 text-xs font-extrabold">
                      Ready to launch with your custom question bank.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-xs border border-emerald-300 dark:border-emerald-500/30 shadow-sm">
                    {parsedResult.totalCategories} Categories
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm">
                    {parsedResult.totalQuestions} Questions Total
                  </span>
                </div>
              </div>

              {/* Detected Categories List */}
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  Detected Categories & Question Pools:
                </span>

                {parsedResult.categories.map((cat, idx) => (
                  <div
                    key={cat.title + idx}
                    className="p-3.5 rounded-xl bg-white dark:bg-[#160c33]/80 border border-purple-200 dark:border-purple-500/25 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span dir="auto" className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                        {cat.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-black uppercase">
                        {cat.type === "complete" ? "✏️ Fill Blanks" : "🔘 MCQ"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30 text-xs font-extrabold">
                        {cat.questions.length} Qs
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10 mt-2">
                <button
                  type="button"
                  onClick={resetState}
                  className="btn-secondary text-sm px-5 py-3 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white w-full sm:w-auto"
                >
                  🔄 Upload a Different File
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="btn-primary btn-emerald text-base font-black px-8 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>✅</span>
                  <span>Use These Questions</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
