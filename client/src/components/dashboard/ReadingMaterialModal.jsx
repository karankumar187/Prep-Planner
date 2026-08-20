import React, { useState } from 'react';
import { X, BookOpen, Clock, CheckCircle2, Copy, Check } from 'lucide-react';
import CategoryPill from '../shared/CategoryPill';

const ReadingMaterialModal = ({ isOpen, onClose, task, enrollmentId, onToggleComplete }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !task) return null;

  const readingContent = task.scheduleTask?.readingContent || 'No study notes provided for this module.';
  const isCompleted = task.completed;

  const handleCopy = () => {
    navigator.clipboard.writeText(readingContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleComplete = () => {
    if (!isCompleted && onToggleComplete) {
      onToggleComplete(task.scheduleTask._id, task.scheduleTask.estimatedMinutes);
    }
    onClose();
  };

  // Simple Markdown Renderer for Headings, Lists, Bold, and Code Blocks
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer = [];

    return lines.map((line, idx) => {
      // Toggle Code Blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const codeText = codeBuffer.join('\n');
          codeBuffer = [];
          return (
            <pre key={idx} className="bg-slate-950 p-4 rounded-xl text-xs md:text-sm font-mono text-emerald-400 overflow-x-auto my-3 border border-slate-700/80 shadow-inner">
              <code>{codeText}</code>
            </pre>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return null;
      }

      // Headings
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-xl md:text-2xl font-bold text-white mt-6 mb-3 pb-2 border-b border-slate-700">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-lg md:text-xl font-bold text-indigo-400 mt-5 mb-2">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-bold text-slate-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        return (
          <li key={idx} className="text-slate-300 ml-4 my-1 list-disc text-sm md:text-base leading-relaxed">
            {parseInlineStyles(itemText)}
          </li>
        );
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={idx} className="border-slate-700 my-4" />;
      }

      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Regular Paragraph
      return (
        <p key={idx} className="text-slate-300 text-sm md:text-base leading-relaxed my-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  // Helper for bold and inline code text
  const parseInlineStyles = (str) => {
    // Bold **text**
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-3 md:p-6">
      <div className="bg-slate-800 rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
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

        {/* Reader Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 custom-scrollbar bg-slate-900/50">
          {renderMarkdown(readingContent)}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={handleCopy}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 text-slate-300 hover:text-white"
          >
            {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </button>

          <div className="flex gap-3 ml-auto">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              Close
            </button>
            <button
              onClick={handleComplete}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md ${
                isCompleted 
                  ? 'bg-slate-700 text-green-400 border border-green-500/30' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20'
              }`}
            >
              <CheckCircle2 size={16} />
              <span>{isCompleted ? 'Completed' : 'Mark as Read'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingMaterialModal;
