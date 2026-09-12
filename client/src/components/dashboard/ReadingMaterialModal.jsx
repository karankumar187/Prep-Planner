import React, { useState } from 'react';
import { X, BookOpen, Clock, CheckCircle2, Copy, Check, HelpCircle, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CategoryPill from '../shared/CategoryPill';
import { completeStudyMaterial } from '../../utils/api';

const ReadingMaterialModal = ({ isOpen, onClose, task, enrollmentId, onToggleComplete, onProceedToQuiz, onStudyCompleted }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [actualMinutes, setActualMinutes] = useState(
    task?.studyMinutes || task?.actualMinutes || task?.scheduleTask?.estimatedMinutes || 30
  );
  const [isSaving, setIsSaving] = useState(false);
  const [justUnlockedQuiz, setJustUnlockedQuiz] = useState(false);

  if (!isOpen || !task) return null;

  const rawContent = task.scheduleTask?.readingContent || 'No study notes provided for this module.';
  const isCompleted = task.completed;
  const hasMCQs = task.scheduleTask?.mcqs && task.scheduleTask.mcqs.length > 0;
  const isStudyAlreadyCompleted = task.studyCompleted || justUnlockedQuiz;

  // Pre-processor for single-line LLM table outputs (converts || or | | between rows to newlines)
  const preprocessContent = (content) => {
    if (!content) return '';
    
    // Replace double pipes (||) or (| |) separating table rows with newlines (\n|)
    let formatted = content.replace(/\|\s*\|/g, '|\n|');

    return formatted;
  };

  const readingContent = preprocessContent(rawContent);

  const handleCopy = () => {
    navigator.clipboard.writeText(readingContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleComplete = async () => {
    const timeToSave = Number(actualMinutes) > 0 
      ? Number(actualMinutes) 
      : (task.scheduleTask?.estimatedMinutes || 30);

    try {
      setIsSaving(true);
      await completeStudyMaterial(task.scheduleTask._id, enrollmentId, timeToSave);
      setIsSaving(false);
      setJustUnlockedQuiz(true);
      if (onStudyCompleted) onStudyCompleted();
      if (!hasMCQs) {
        if (onToggleComplete) {
          onToggleComplete(task.scheduleTask._id, timeToSave, true);
        }
        onClose();
      }
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      // Fallback
      if (onToggleComplete) {
        onToggleComplete(task.scheduleTask._id, timeToSave, true);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6">
      <div className="bg-slate-800 rounded-2xl w-[96vw] max-w-6xl xl:max-w-7xl border border-slate-700 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-700 bg-slate-800/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0">
              <BookOpen size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{task.scheduleTask.title}</h2>
                <CategoryPill category={task.scheduleTask.category} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1"><Clock size={12} /> {task.scheduleTask.estimatedMinutes} min read</span>
                <span>•</span>
                <span>Study Reading Material</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy study notes"
            >
              {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Reader Body with ReactMarkdown, remarkGfm & Styled Table Components */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 custom-scrollbar bg-slate-900/50">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-xl md:text-2xl font-extrabold text-white mt-6 mb-3 pb-2 border-b border-slate-700/80 tracking-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg md:text-xl font-bold text-indigo-400 mt-5 mb-2 flex items-center gap-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mt-4 mb-2">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 text-sm md:text-base leading-relaxed my-2">
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white bg-slate-800/80 px-1 py-0.5 rounded">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-purple-200">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-slate-300 my-3 text-sm md:text-base">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-5 space-y-1.5 text-slate-300 my-3 text-sm md:text-base">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed text-slate-300">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-500/10 text-indigo-200 rounded-r-xl italic text-sm">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="border-slate-700/80 my-6" />,
              code: ({ node, inline, className, children, ...props }) => {
                if (inline) {
                  return (
                    <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-slate-950 p-4 md:p-5 rounded-xl text-xs md:text-sm font-mono text-emerald-400 overflow-x-auto my-4 border border-slate-700/80 shadow-inner whitespace-pre-wrap break-words leading-relaxed">
                    <code {...props}>{children}</code>
                  </pre>
                );
              },
              table: ({ children }) => (
                <div className="overflow-x-auto my-5 rounded-xl border border-slate-700 shadow-lg bg-slate-900/80">
                  <table className="w-full text-left text-xs md:text-sm text-slate-200 border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-800 text-indigo-300 font-bold border-b border-slate-700">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-slate-800/80">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-slate-800/50 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="p-3.5 font-bold border-r border-slate-700/60 last:border-r-0 whitespace-normal">{children}</th>
              ),
              td: ({ children }) => (
                <td className="p-3 border-r border-slate-800/60 last:border-r-0 whitespace-normal break-words">{children}</td>
              )
            }}
          >
            {readingContent}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-between items-center px-6 py-4 border-t border-slate-700 bg-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-slate-300 hover:text-white"
            >
              {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Actual Time Input */}
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Clock size={14} className="text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">Actual Time:</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  placeholder={`${task.scheduleTask?.estimatedMinutes || 30}`}
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(e.target.value)}
                  className="bg-slate-800 border border-slate-600 rounded-l-lg px-2 py-1 text-xs text-white w-16 outline-none focus:border-indigo-500 font-mono text-center"
                />
                <span className="bg-slate-700 border border-l-0 border-slate-600 rounded-r-lg px-2 py-1 text-xs text-slate-400 font-mono">
                  mins
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 ml-auto flex-wrap items-center">
            <button onClick={onClose} className="px-3.5 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-750 transition-colors">
              Close
            </button>
            
            <button
              onClick={handleComplete}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                isStudyAlreadyCompleted 
                  ? 'bg-slate-700 hover:bg-slate-650 text-slate-200 border border-slate-600' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
              }`}
            >
              <CheckCircle2 size={16} className={isStudyAlreadyCompleted ? 'text-emerald-400' : ''} />
              <span>{isSaving ? 'Saving...' : isStudyAlreadyCompleted ? 'Update Study Time' : hasMCQs ? 'Complete & Unlock Quiz' : 'Mark as Completed'}</span>
            </button>

            {hasMCQs && isStudyAlreadyCompleted && onProceedToQuiz && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToQuiz();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 animate-pulse"
              >
                <span>Take Quiz (10 Qs, 40 min)</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingMaterialModal;
