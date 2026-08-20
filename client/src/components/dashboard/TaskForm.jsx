import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { Plus, Trash2, HelpCircle, Link as LinkIcon, CheckSquare, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { generateAIMCQs, generateAIReading } from '../../utils/api';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData = null, dayNumber = 1, defaultTaskType = 'task' }) => {
  const [taskType, setTaskType] = useState(defaultTaskType);
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

  // AI Generator states
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  useEffect(() => {
    if (initialData) {
      const type = initialData.taskType || 
        (initialData.category === 'Reading Material' || !!initialData.readingContent ? 'reading' :
        (initialData.category === 'MCQ Assessment' || (initialData.mcqs && initialData.mcqs.length > 0) ? 'assessment' : 'task'));
      
      setTaskType(type);
      setFormData({
        title: initialData.title || '',
        category: initialData.category || (type === 'reading' ? 'Reading Material' : CATEGORIES[0]),
        link: initialData.link || '',
        readingContent: initialData.readingContent || '',
        dayNumber: initialData.dayNumber || dayNumber,
        priority: initialData.priority || 'Medium',
        estimatedMinutes: initialData.estimatedMinutes || 30,
        mcqs: initialData.mcqs || []
      });
    } else {
      const type = defaultTaskType;
      setTaskType(type);
      setFormData({
        title: '',
        category: type === 'reading' ? 'Reading Material' : (type === 'assessment' ? 'MCQ Assessment' : CATEGORIES[0]),
        link: '',
        readingContent: '',
        dayNumber: dayNumber,
        priority: 'Medium',
        estimatedMinutes: 30,
        mcqs: []
      });
    }
    setShowAIPrompt(false);
    setAiNotice('');
  }, [initialData, dayNumber, defaultTaskType, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setTaskType(type);
    if (type === 'reading' && formData.category !== 'Reading Material') {
      setFormData({ ...formData, category: 'Reading Material' });
    } else if (type === 'assessment' && formData.category !== 'MCQ Assessment') {
      setFormData({ ...formData, category: 'MCQ Assessment' });
    }
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      mcqs: [
        ...formData.mcqs,
        {
          question: '',
          options: ['', '', '', ''],
          correctOption: 0
        }
      ]
    });
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

  const handleGenerateAIMCQs = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    try {
      setIsGenerating(true);
      setAiNotice('');
      const res = await generateAIMCQs(aiTopic, aiNumQuestions, formData.estimatedMinutes);

      setFormData(prev => ({
        ...prev,
        title: res.data.title || `${aiTopic} — MCQ Assessment`,
        category: 'MCQ Assessment',
        mcqs: res.data.mcqs || []
      }));

      setIsGenerating(false);
      setShowAIPrompt(false);
      setAiNotice(`✨ AI generated ${res.data.mcqs?.length || 0} questions on "${aiTopic}"!`);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setAiNotice('Failed to generate AI questions. Please try again.');
    }
  };

  const handleGenerateAIReading = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    try {
      setIsGenerating(true);
      setAiNotice('');
      const res = await generateAIReading(aiTopic, formData.estimatedMinutes);

      setFormData(prev => ({
        ...prev,
        title: res.data.title || `${aiTopic} Study Material`,
        category: 'Reading Material',
        readingContent: res.data.readingContent || ''
      }));

      setIsGenerating(false);
      setShowAIPrompt(false);
      setAiNotice(`✨ AI generated study material for "${aiTopic}"!`);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setAiNotice('Failed to generate reading material. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      taskType
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl border border-slate-700 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header with Type Selector */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700 flex-wrap gap-2">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Item' : taskType === 'reading' ? 'Add Reading Material' : taskType === 'assessment' ? 'Add MCQ Assessment' : 'Add Study Task'}
          </h2>

          {/* Mode Switcher Buttons */}
          <div className="bg-slate-900 p-1 rounded-xl flex border border-slate-700 gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleTypeChange('task')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                taskType === 'task' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare size={14} />
              <span>Standard Task</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('reading')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                taskType === 'reading' ? 'bg-purple-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen size={14} />
              <span>Reading Material</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('assessment')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                taskType === 'assessment' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle size={14} />
              <span>MCQ Assessment</span>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {aiNotice && (
            <div className="bg-purple-500/10 border border-purple-500/30 text-purple-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-medium">
              <Sparkles size={16} className="text-purple-400 flex-shrink-0" />
              <span>{aiNotice}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {taskType === 'reading' ? 'Reading Module Title' : taskType === 'assessment' ? 'Assessment Title' : 'Task Title'}
            </label>
            <input 
              required
              type="text" 
              placeholder={
                taskType === 'reading' ? "e.g. DBMS Normalization (1NF to BCNF) Study Notes" :
                taskType === 'assessment' ? "e.g. SQL JOINs Quiz Assessment" : 
                "e.g. Solve 2 LeetCode Array Problems"
              }
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
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
              placeholder="e.g. https://leetcode.com/problems/two-sum or https://geeksforgeeks.org/..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Day Number</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={formData.dayNumber}
                onChange={(e) => setFormData({...formData, dayNumber: parseInt(e.target.value) || 1})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {taskType === 'reading' ? 'Estimated Reading Mins' : 'Time Limit / Est. Mins'}
              </label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={formData.estimatedMinutes}
                onChange={(e) => setFormData({...formData, estimatedMinutes: parseInt(e.target.value) || 15})}
              />
            </div>
          </div>

          {/* Reading Material Section */}
          {taskType === 'reading' && (
            <div className="mt-6 pt-4 border-t border-slate-700 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <BookOpen size={18} className="text-purple-400" />
                  <span>Reading Material Content</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow transition-all"
                >
                  <Sparkles size={14} />
                  <span>Auto-Generate Notes with AI</span>
                </button>
              </div>

              {/* AI Reading Prompt Box */}
              {showAIPrompt && (
                <div className="bg-slate-900/90 border border-purple-500/40 p-4 rounded-xl space-y-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-400" />
                      <span>Hugging Face AI Reading Generator</span>
                    </span>
                    <button type="button" onClick={() => setShowAIPrompt(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Topic / Concepts to Explain</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DBMS Normalization (1NF to BCNF) with SQL Examples, React useEffect Cleanups"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500"
                      value={aiTopic}
                      onChange={e => setAiTopic(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      disabled={isGenerating || !aiTopic.trim()}
                      onClick={handleGenerateAIReading}
                      className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Generating Study Notes...</span>
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
                rows={8}
                placeholder="Enter or paste study notes, concepts, and code examples here (Markdown supported)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:border-purple-500"
                value={formData.readingContent}
                onChange={e => setFormData({ ...formData, readingContent: e.target.value })}
              />
              <p className="text-[11px] text-slate-400">* Supports Markdown formatting: # Headings, **bold**, - lists, and ```code``` blocks.</p>
            </div>
          )}

          {/* MCQ Question Builder & AI Generator Section */}
          {(taskType === 'assessment' || formData.mcqs.length > 0) && (
            <div className="mt-6 pt-4 border-t border-slate-700">
              <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <HelpCircle size={18} className="text-rose-400" />
                  <span>MCQ Assessment Questions ({formData.mcqs.length})</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAIPrompt(!showAIPrompt)}
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

              {/* AI Prompt Box */}
              {showAIPrompt && (
                <div className="bg-slate-900/90 border border-indigo-500/40 p-4 rounded-xl mb-4 space-y-3 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-400" />
                      <span>Hugging Face AI Quiz Generator</span>
                    </span>
                    <button type="button" onClick={() => setShowAIPrompt(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">Topic / Prompt</label>
                      <input 
                        type="text" 
                        placeholder="e.g. SQL JOINs and Aggregations, React State Management, DBMS ACID Properties"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500"
                        value={aiTopic}
                        onChange={e => setAiTopic(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Number of Questions</label>
                      <select 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                        value={aiNumQuestions}
                        onChange={e => setAiNumQuestions(Number(e.target.value))}
                      >
                        <option value={3}>3 Questions</option>
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={15}>15 Questions</option>
                        <option value={20}>20 Questions</option>
                        <option value={25}>25 Questions</option>
                        <option value={30}>30 Questions</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      disabled={isGenerating || !aiTopic.trim()}
                      onClick={handleGenerateAIMCQs}
                      className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Generating Quiz...</span>
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
                  Click <strong>"Generate with AI (Hugging Face)"</strong> to auto-create questions from a prompt, or <strong>"+ Manual Question"</strong> to type your own.
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {formData.mcqs.map((q, qIdx) => (
                    <div key={qIdx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-3">
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
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-rose-500"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      />

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
                            <input 
                              type="radio" 
                              name={`correct-${qIdx}`} 
                              checked={q.correctOption === optIdx}
                              onChange={() => handleQuestionChange(qIdx, 'correctOption', optIdx)}
                              className="accent-rose-500 cursor-pointer"
                              title="Mark as correct answer"
                            />
                            <span className="text-xs font-bold text-slate-400 w-4">{String.fromCharCode(65 + optIdx)}</span>
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
                      <div className="text-[11px] text-slate-400 text-right">
                        * Select radio button next to the correct answer
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors">
              Save {taskType === 'reading' ? 'Reading Material' : taskType === 'assessment' ? 'Assessment' : 'Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
