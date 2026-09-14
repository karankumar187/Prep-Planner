import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { Plus, Trash2, HelpCircle, Link as LinkIcon, CheckSquare, Sparkles, Loader2, BookOpen, X, ChevronDown, ChevronUp } from 'lucide-react';
import { generateAIMCQs, generateAIReading } from '../../utils/api';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = null, dayNumber = 1 }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    link: '',
    readingContent: '',
    dayNumber: dayNumber,
    priority: 'Medium',
    estimatedMinutes: 30,
    mcqs: []
  });

  // Optional feature toggles
  const [includeReading, setIncludeReading] = useState(false);
  const [includeQuiz, setIncludeQuiz] = useState(false);

  // AI Reading Generator states
  const [showAIReading, setShowAIReading] = useState(false);
  const [aiReadingTopic, setAiReadingTopic] = useState('');
  const [isGeneratingReading, setIsGeneratingReading] = useState(false);
  const [readingElapsedSeconds, setReadingElapsedSeconds] = useState(0);
  const [readingNotice, setReadingNotice] = useState('');

  // AI Quiz Generator states
  const [showAIQuiz, setShowAIQuiz] = useState(false);
  const [aiQuizTopic, setAiQuizTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(10);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizElapsedSeconds, setQuizElapsedSeconds] = useState(0);
  const [quizNotice, setQuizNotice] = useState('');

  // Live timer for reading generation
  useEffect(() => {
    let timer;
    if (isGeneratingReading) {
      setReadingElapsedSeconds(0);
      timer = setInterval(() => {
        setReadingElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setReadingElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isGeneratingReading]);

  // Live timer for quiz generation
  useEffect(() => {
    let timer;
    if (isGeneratingQuiz) {
      setQuizElapsedSeconds(0);
      timer = setInterval(() => {
        setQuizElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setQuizElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isGeneratingQuiz]);

  // Initialize or reset form data when opening / editing
  useEffect(() => {
    if (initialData) {
      const hasReading = Boolean(initialData.readingContent && initialData.readingContent.trim().length > 0);
      const hasQuiz = Boolean(initialData.mcqs && initialData.mcqs.length > 0);

      setFormData({
        title: initialData.title || '',
        category: (initialData.category && CATEGORIES.includes(initialData.category)) ? initialData.category : CATEGORIES[0],
        link: initialData.link || '',
        readingContent: initialData.readingContent || '',
        dayNumber: initialData.dayNumber || dayNumber,
        priority: initialData.priority || 'Medium',
        estimatedMinutes: initialData.estimatedMinutes || 30,
        mcqs: initialData.mcqs || []
      });
      setIncludeReading(hasReading);
      setIncludeQuiz(hasQuiz);
    } else {
      setFormData({
        title: '',
        category: CATEGORIES[0],
        link: '',
        readingContent: '',
        dayNumber: dayNumber,
        priority: 'Medium',
        estimatedMinutes: 30,
        mcqs: []
      });
      setIncludeReading(false);
      setIncludeQuiz(false);
    }

    setShowAIReading(false);
    setShowAIQuiz(false);
    setReadingNotice('');
    setQuizNotice('');
    setAiReadingTopic('');
    setAiQuizTopic('');
  }, [initialData, dayNumber, isOpen]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setIncludeQuiz(true);
    setFormData(prev => ({
      ...prev,
      mcqs: [
        ...prev.mcqs,
        {
          question: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx) => {
    const updated = formData.mcqs.filter((_, i) => i !== idx);
    setFormData({ ...formData, mcqs: updated });
  };

  const handleQuestionChange = (qIdx, field, value) => {
    const updated = [...formData.mcqs];
    if (field === 'question' || field === 'correctOption') {
      updated[qIdx][field] = value;
    }
    setFormData({ ...formData, mcqs: updated });
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...formData.mcqs];
    updated[qIdx].options[optIdx] = value;
    setFormData({ ...formData, mcqs: updated });
  };

  const handleGenerateAIReading = async (e) => {
    e.preventDefault();
    const topic = aiReadingTopic.trim() || formData.title.trim();
    if (!topic) return;

    try {
      setIsGeneratingReading(true);
      setReadingNotice('');
      const res = await generateAIReading(topic, formData.estimatedMinutes);

      setFormData(prev => ({
        ...prev,
        title: prev.title || res.data.title || `${topic} Study Material`,
        readingContent: res.data.readingContent || ''
      }));

      setIncludeReading(true);
      setIsGeneratingReading(false);
      setShowAIReading(false);
      setReadingNotice(`✨ Generated detailed study notes for "${topic}"!`);
    } catch (err) {
      console.error(err);
      setIsGeneratingReading(false);
      setReadingNotice('Failed to generate reading material. Please try again.');
    }
  };

  const handleGenerateAIMCQs = async (e) => {
    e.preventDefault();
    const topic = aiQuizTopic.trim() || formData.title.trim();
    if (!topic) return;

    try {
      setIsGeneratingQuiz(true);
      setQuizNotice('');
      const res = await generateAIMCQs(topic, aiNumQuestions, formData.estimatedMinutes);

      const safeMCQs = (res.data.mcqs || []).map(q => ({
        question: q.question || q.q || '',
        options: Array.isArray(q.options) && q.options.length >= 4 ? q.options : Array.isArray(q.opts) && q.opts.length >= 4 ? q.opts : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOption: typeof q.correctOption === 'number' ? q.correctOption : typeof q.correct === 'number' ? q.correct : 0
      }));

      setFormData(prev => ({
        ...prev,
        title: prev.title || res.data.title || `${topic} — Assessment`,
        mcqs: safeMCQs
      }));

      setIncludeQuiz(true);
      setIsGeneratingQuiz(false);
      setShowAIQuiz(false);
      setQuizNotice(`✨ Generated ${safeMCQs.length} questions on "${topic}"!`);
    } catch (err) {
      console.error(err);
      setIsGeneratingQuiz(false);
      setQuizNotice('Failed to generate AI questions. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalReading = includeReading ? (formData.readingContent || '').trim() : '';
    const finalMCQs = includeQuiz ? formData.mcqs : [];

    // Determine backward-compatible taskType
    let computedType = 'task';
    if (includeQuiz && finalMCQs.length > 0) {
      computedType = 'assessment';
    } else if (includeReading && finalReading.length > 0) {
      computedType = 'reading';
    }

    onSubmit({
      ...formData,
      readingContent: finalReading,
      mcqs: finalMCQs,
      taskType: computedType
    });
  };

  const getQuizProgressText = () => {
    if (quizElapsedSeconds < 4) return "Connecting to AI engine...";
    if (quizElapsedSeconds < 9) return `Drafting ${aiNumQuestions} diverse placement questions in parallel...`;
    return "Balancing answer keys & shuffling options...";
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <CheckSquare size={20} className="text-indigo-400" />
              <span>{initialData ? 'Edit Task' : 'Add Task'}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure task details, with optional study material and quiz in one place.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Core Fields */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. Solve 2 LeetCode Array Problems or DBMS Normalization"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1">
              <LinkIcon size={14} className="text-indigo-400" />
              <span>Resource / Practice Link (Optional)</span>
            </label>
            <input 
              type="url" 
              placeholder="e.g. https://leetcode.com/problems/... or https://geeksforgeeks.org/..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Day Number <span className="text-rose-400">*</span>
              </label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                value={formData.dayNumber}
                onChange={(e) => setFormData({...formData, dayNumber: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Time Limit / Est. Mins <span className="text-rose-400">*</span>
              </label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({...formData, estimatedMinutes: parseInt(e.target.value) || 30})}
              />
            </div>
          </div>

          {/* SECTION 1: Reading Material / Study Notes (Optional) */}
          <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-850/60 transition-all">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer bg-slate-750 hover:bg-slate-700/80 select-none transition-colors"
              onClick={() => setIncludeReading(!includeReading)}
            >
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox"
                  checked={includeReading}
                  onChange={(e) => setIncludeReading(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-400" />
                  <span className="text-sm font-semibold text-white">Study Notes / Reading Material</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-purple-400 font-medium">
                  {includeReading ? 'Included' : '+ Add Notes'}
                </span>
                {includeReading ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </div>

            {includeReading && (
              <div className="p-4 border-t border-slate-750 space-y-3 bg-slate-900/50">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-medium text-slate-300">Reading Content (Markdown supported)</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!aiReadingTopic && formData.title) setAiReadingTopic(formData.title);
                      setShowAIReading(!showAIReading);
                    }}
                    className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow transition-all"
                  >
                    <Sparkles size={14} />
                    <span>Auto-Generate Notes with AI</span>
                  </button>
                </div>

                {readingNotice && (
                  <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2 font-medium">
                    <Sparkles size={14} className="text-purple-400 flex-shrink-0" />
                    <span>{readingNotice}</span>
                  </div>
                )}

                {/* AI Reading Prompt Box */}
                {showAIReading && (
                  <div className="bg-slate-900 border border-purple-500/40 p-3.5 rounded-xl space-y-3 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-purple-400" />
                        <span>Hugging Face AI Reading Generator</span>
                      </span>
                      <button type="button" onClick={() => setShowAIReading(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Topic / Concepts to Explain</label>
                      <input 
                        type="text" 
                        placeholder={formData.title || "e.g. DBMS Normalization with SQL Examples"}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500"
                        value={aiReadingTopic}
                        onChange={e => setAiReadingTopic(e.target.value)}
                      />
                    </div>

                    {isGeneratingReading && (
                      <div className="bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs text-purple-200 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin text-purple-400" />
                          <span>Generating comprehensive study notes with syntax and examples...</span>
                        </div>
                        <span className="font-mono font-bold">{readingElapsedSeconds}s</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button 
                        type="button"
                        disabled={isGeneratingReading || (!aiReadingTopic.trim() && !formData.title.trim())}
                        onClick={handleGenerateAIReading}
                        className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow"
                      >
                        {isGeneratingReading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Generating ({readingElapsedSeconds}s)...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Generate Notes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  rows={7}
                  placeholder="Enter or paste study notes, concepts, and code examples here (Markdown supported)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:border-purple-500"
                  value={formData.readingContent}
                  onChange={e => setFormData({ ...formData, readingContent: e.target.value })}
                />
                <p className="text-[11px] text-slate-400">* Supports Markdown formatting: # Headings, **bold**, - lists, and ```code``` blocks.</p>
              </div>
            )}
          </div>

          {/* SECTION 2: Assessment Quiz (MCQs) (Optional) */}
          <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-850/60 transition-all">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer bg-slate-750 hover:bg-slate-700/80 select-none transition-colors"
              onClick={() => setIncludeQuiz(!includeQuiz)}
            >
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox"
                  checked={includeQuiz}
                  onChange={(e) => setIncludeQuiz(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <HelpCircle size={16} className="text-rose-400" />
                  <span className="text-sm font-semibold text-white">Assessment Quiz (MCQs)</span>
                  {formData.mcqs.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {formData.mcqs.length} Questions
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-medium">
                  {includeQuiz ? 'Included' : '+ Add Quiz'}
                </span>
                {includeQuiz ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </div>
            </div>

            {includeQuiz && (
              <div className="p-4 border-t border-slate-750 space-y-3 bg-slate-900/50">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-xs font-medium text-slate-300">
                    Quiz Questions ({formData.mcqs.length})
                  </span>

                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!aiQuizTopic && formData.title) setAiQuizTopic(formData.title);
                        setShowAIQuiz(!showAIQuiz);
                      }}
                      className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow transition-all"
                    >
                      <Sparkles size={14} />
                      <span>Generate with AI (Hugging Face)</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={handleAddQuestion}
                      className="flex items-center gap-1 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                    >
                      <Plus size={14} />
                      <span>Manual Question</span>
                    </button>
                  </div>
                </div>

                {quizNotice && (
                  <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2 font-medium">
                    <Sparkles size={14} className="text-rose-400 flex-shrink-0" />
                    <span>{quizNotice}</span>
                  </div>
                )}

                {/* AI Quiz Prompt Box */}
                {showAIQuiz && (
                  <div className="bg-slate-900 border border-indigo-500/40 p-3.5 rounded-xl space-y-3 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span>Hugging Face Fast AI Quiz Generator</span>
                      </span>
                      <button type="button" onClick={() => setShowAIQuiz(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1">Topic / Prompt</label>
                        <input 
                          type="text" 
                          placeholder={formData.title || "e.g. SQL JOINs, React State Management"}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500"
                          value={aiQuizTopic}
                          onChange={e => setAiQuizTopic(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Questions Count</label>
                        <select 
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                          value={aiNumQuestions}
                          onChange={e => setAiNumQuestions(Number(e.target.value))}
                        >
                          <option value={3}>3 Questions</option>
                          <option value={5}>5 Questions</option>
                          <option value={10}>10 Questions (OA Standard)</option>
                          <option value={15}>15 Questions</option>
                          <option value={20}>20 Questions</option>
                          <option value={25}>25 Questions</option>
                          <option value={30}>30 Questions</option>
                        </select>
                      </div>
                    </div>

                    {isGeneratingQuiz && (
                      <div className="bg-indigo-950/40 border border-indigo-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs text-indigo-200 animate-pulse">
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin text-indigo-400" />
                          <span>{getQuizProgressText()}</span>
                        </div>
                        <span className="font-mono font-bold">{quizElapsedSeconds}s</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button 
                        type="button"
                        disabled={isGeneratingQuiz || (!aiQuizTopic.trim() && !formData.title.trim())}
                        onClick={handleGenerateAIMCQs}
                        className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors shadow"
                      >
                        {isGeneratingQuiz ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Generating ({quizElapsedSeconds}s)...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} />
                            <span>Generate MCQs</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {formData.mcqs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    Click <strong>"Generate with AI (Hugging Face)"</strong> to auto-create questions, or <strong>"+ Manual Question"</strong> to create your own.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {formData.mcqs.map((q, qIdx) => (
                      <div key={qIdx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Question {qIdx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="text-slate-400 hover:text-red-400 p-1"
                            title="Remove question"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <input 
                          required
                          type="text" 
                          placeholder={`Enter Question ${qIdx + 1} statement...`}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-xs focus:border-rose-500"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {(q.options || ['', '', '', '']).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                              <input 
                                type="radio" 
                                name={`correct-${qIdx}`} 
                                checked={q.correctOption === optIdx}
                                onChange={() => handleQuestionChange(qIdx, 'correctOption', optIdx)}
                                className="accent-rose-500 cursor-pointer"
                                title="Mark as correct answer"
                              />
                              <span className="text-xs font-bold text-slate-400 w-3">{String.fromCharCode(65 + optIdx)}</span>
                              <input 
                                required
                                type="text" 
                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                className="bg-transparent border-none text-white text-xs flex-1 focus:outline-none"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400 text-right">
                          * Select radio button next to the correct answer
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow text-sm">
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
