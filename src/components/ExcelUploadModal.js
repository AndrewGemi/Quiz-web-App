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
      setError(
        err.message ||
          "Failed to process spreadsheet file. Please check that columns match the template format."
      );
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 25 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl glass-card bg-white/95 dark:bg-[#130728]/95 border-2 border-purple-200/90 dark:border-purple-500/40 rounded-[2.25rem] p-6 sm:p-9 shadow-2xl relative my-8 overflow-hidden"
        >
          {/* Subtle Ambient Glow inside Modal */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-purple-100 dark:border-purple-500/20">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400 mb-2.5 shadow-md shadow-violet-500/25">
                <span>✨</span>
                <span>Custom Question Importer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight">
                <span className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xl sm:text-2xl shadow-inner">
                  📊
                </span>
                <span>Import from Spreadsheet</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 font-medium leading-relaxed">
                Upload your custom question bank to host customized multiplayer quiz tournaments.
              </p>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-lg transition-colors shrink-0 cursor-pointer border border-slate-200 dark:border-white/10 shadow-sm"
              aria-label="Close modal"
              type="button"
            >
              ✕
            </motion.button>
          </div>

          {/* Excel Template Helper Banner */}
          <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 border-2 border-purple-200/90 dark:border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                📥
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  Need the Official Excel Template?
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
                  Includes formatted columns for Arabic/English questions, 4 options, and correct answers.
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={downloadExcelTemplate}
              className="whitespace-nowrap text-xs sm:text-sm px-4 py-2.5 rounded-xl border-2 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 bg-white dark:bg-emerald-950/40 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 flex items-center gap-2 font-black shrink-0 shadow-md cursor-pointer transition-all"
            >
              <span>📄</span>
              <span>Download Template (.xlsx)</span>
            </motion.button>
          </div>

          {/* Drag & Drop Upload Area (when no file is loaded yet) */}
          {!parsedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3.5 relative overflow-hidden group ${
                isDragging
                  ? "border-violet-500 bg-violet-50/80 dark:bg-violet-950/40 scale-[1.01] shadow-xl shadow-violet-500/20"
                  : "border-purple-300 dark:border-purple-500/40 hover:border-violet-500 bg-purple-50/30 dark:bg-white/[0.02] hover:bg-purple-50/80 dark:hover:bg-purple-950/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 text-white flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-violet-500/30 mb-2 group-hover:scale-110 transition-transform duration-300">
                📁
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin shadow-md" />
                  <p className="text-slate-800 dark:text-slate-200 font-extrabold text-base">
                    Extracting questions from{" "}
                    <span className="text-violet-600 dark:text-violet-400 font-black">
                      {uploadedFileName}
                    </span>
                    ...
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Drop your spreadsheet here, or{" "}
                    <span className="text-violet-600 dark:text-violet-400 underline decoration-2 decoration-violet-400 underline-offset-4 font-black">
                      browse files
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-500/30">
                      📊 Excel (.xlsx, .xls)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-black text-xs border border-cyan-300 dark:border-cyan-500/30">
                      📄 CSV (.csv)
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Error Callout */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-500/50 text-rose-900 dark:text-rose-200 flex items-start gap-3.5 text-sm font-medium shadow-md"
            >
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <p className="font-black text-rose-950 dark:text-rose-100 text-base">
                  Spreadsheet Processing Error
                </p>
                <p className="mt-1 text-rose-800 dark:text-rose-300 font-semibold">{error}</p>
                <p className="mt-2 text-xs text-rose-700 dark:text-rose-400 font-medium">
                  Tip: Make sure your columns include <code>Category</code>, <code>Question</code>,{" "}
                  <code>Option A</code>, <code>Option B</code>, <code>Option C</code>,{" "}
                  <code>Option D</code>, and <code>Correct Answer</code>.
                </p>
              </div>
            </motion.div>
          )}

          {/* Parsed Result & Category Preview Roster */}
          {parsedResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 mt-2"
            >
              {/* Success Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-500/40 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-emerald-500/30">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
                      {uploadedFileName || "Spreadsheet"} Loaded!
                    </h4>
                    <p className="text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-extrabold">
                      All questions parsed and validated successfully.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-xs sm:text-sm border border-emerald-300 dark:border-emerald-500/40 shadow-sm">
                    {parsedResult.totalCategories} Categories
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30">
                    {parsedResult.totalQuestions} Questions Total
                  </span>
                </div>
              </div>

              {/* Detected Category Roster Cards */}
              <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-400">
                  Detected Category Pools:
                </span>

                {parsedResult.categories.map((cat, idx) => (
                  <div
                    key={cat.title + idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#160c33]/90 border-2 border-purple-100 hover:border-purple-300 dark:border-purple-500/25 dark:hover:border-purple-500/50 flex items-center justify-between gap-3 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
                        {idx + 1}
                      </span>
                      <span
                        dir="auto"
                        className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base truncate"
                      >
                        {cat.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-black uppercase">
                        {cat.type === "complete" ? "✏️ Fill Blanks" : "🔘 MCQ"}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-950 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30 text-xs font-black">
                        {cat.questions.length} Qs
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-purple-100 dark:border-purple-500/20 mt-2">
                <button
                  type="button"
                  onClick={resetState}
                  className="px-5 py-3 rounded-xl border-2 border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-black text-sm w-full sm:w-auto transition-all cursor-pointer shadow-sm"
                >
                  🔄 Upload a Different File
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleConfirm}
                  className="btn-primary btn-emerald text-base font-black px-8 py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>✅</span>
                  <span>Confirm & Use Questions</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
