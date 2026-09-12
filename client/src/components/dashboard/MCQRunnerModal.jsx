import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, XCircle, Trophy, Clock, AlertTriangle } from 'lucide-react';
import { submitMCQ } from '../../utils/api';

const MCQRunnerModal = ({ isOpen, onClose, task, enrollmentId, onSubmitted }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { 0: 2, 1: 0, ... }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // Timer states (40 minutes assigned for assessment quiz as required)
  const timeLimitMinutes = 40;
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(timeLimitMinutes * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const timerRef = useRef(null);

  const [retaking, setRetaking] = useState(false);

  // Reset retaking and result when modal closes or opens for a new task
  useEffect(() => {
    setResult(null);
    setRetaking(false);
  }, [isOpen, task?.scheduleTask?._id]);

  const mcqs = task?.scheduleTask?.mcqs || [];
  
  // A completed quiz result exists only if task is completed AND has a positive total questions score AND has saved answers
  const hasTakenQuiz = Boolean(
    task?.completed && 
    task?.mcqScore && 
    task.mcqScore.total > 0 && 
    Array.isArray(task?.mcqAnswers) && 
    task.mcqAnswers.length > 0
  );

  const activeResult = result || (!retaking && hasTakenQuiz ? { mcqScore: task.mcqScore, mcqAnswers: task.mcqAnswers } : null);

  // Initialize timer on open
  useEffect(() => {
    if (isOpen && task && !activeResult) {
      const initialSeconds = timeLimitMinutes * 60;
      setTimeLeftSeconds(initialSeconds);
      setElapsedSeconds(0);
      setAutoSubmitted(false);
      setCurrentIdx(0);
      setUserAnswers({});

      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, task, activeResult]);

  // Handle auto-submit when timer reaches 0
  useEffect(() => {
    if (isOpen && !activeResult && timeLeftSeconds === 0 && !isSubmitting) {
      setAutoSubmitted(true);
      handleSubmit(true);
    }
  }, [timeLeftSeconds, isOpen, activeResult]);

  if (!isOpen || !task) return null;

  const handleOptionSelect = (qIdx, optIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      setIsSubmitting(true);
      const answersArray = Object.keys(userAnswers).map(qIdx => ({
        questionIndex: Number(qIdx),
        selectedOption: userAnswers[qIdx]
      }));

      // Compute exact time taken in minutes (rounded to 1 decimal or at least 1 min)
      const exactTimeMins = Math.max(0.1, parseFloat((elapsedSeconds / 60).toFixed(1)));

      const res = await submitMCQ(
        task.scheduleTask._id, 
        enrollmentId, 
        answersArray, 
        exactTimeMins
      );
      
      setResult(res.data);
      if (isAuto) setAutoSubmitted(true);
      setIsSubmitting(false);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Format MM:SS
  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatElapsed = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins === 0) return `${secs} sec`;
    return `${mins} min ${secs} sec`;
  };

  const isLowTime = timeLeftSeconds <= 60 && !activeResult;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-6">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl xl:max-w-5xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-800/90">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{task.scheduleTask.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">MCQ Assessment • {mcqs.length} Questions</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer Badge */}
            {!activeResult && mcqs.length > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold transition-all ${
                isLowTime 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' 
                  : 'bg-slate-900 text-amber-400 border border-slate-700'
              }`}>
                <Clock size={16} className={isLowTime ? 'text-red-400' : 'text-amber-400'} />
                <span>{formatTimer(timeLeftSeconds)}</span>
              </div>
            )}

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeResult && activeResult.mcqScore ? (
            /* Results View */
            <div className="space-y-6">
              {autoSubmitted && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl flex items-center gap-3">
                  <AlertTriangle size={24} className="text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold">Time's Up!</div>
                    <div className="text-xs text-amber-200/80">The assessment reached the time limit ({timeLimitMinutes} min) and was automatically submitted.</div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-6 text-center">
                <Trophy size={48} className="text-indigo-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">Assessment Score</h3>
                <div className="text-4xl font-extrabold text-indigo-400 my-2">
                  {activeResult.mcqScore.score} / {activeResult.mcqScore.total}
                </div>
                <div className="text-sm font-semibold text-indigo-300 mb-4">
                  {activeResult.mcqScore.percentage}% Overall Score
                </div>

                <div className="inline-flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-lg text-xs text-slate-300 border border-slate-700">
                  <Clock size={14} className="text-indigo-400" />
                  <span>Time Taken: <strong className="text-white">{formatElapsed(elapsedSeconds || (task.actualMinutes ? task.actualMinutes * 60 : 0))}</strong></span>
                  <span className="text-slate-500">|</span>
                  <span>Limit: <strong className="text-white">{timeLimitMinutes} min</strong></span>
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setRetaking(true);
                      setUserAnswers({});
                      setCurrentIdx(0);
                      setTimeLeftSeconds(timeLimitMinutes * 60);
                      setElapsedSeconds(0);
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <span>Retake Assessment</span>
                  </button>
                </div>
              </div>

              {/* Question Breakdown */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-lg">Answer Key & Review</h4>
                {mcqs.map((q, idx) => {
                  const ansObj = activeResult.mcqAnswers?.find(a => a.questionIndex === idx);
                  const isCorrect = ansObj ? ansObj.isCorrect : false;
                  const selectedOpt = ansObj ? ansObj.selectedOption : -1;

                  return (
                    <div key={idx} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-white mb-3">Q{idx + 1}. {q.question}</p>
                          <div className="space-y-2 text-sm">
                            {q.options.map((opt, oIdx) => {
                              const isThisSelected = selectedOpt === oIdx;
                              const isThisRight = q.correctOption === oIdx;

                              let bgClass = 'bg-slate-900/60 border-slate-700 text-slate-300';
                              if (isThisRight) {
                                bgClass = 'bg-green-500/20 border-green-500/50 text-green-200 font-medium';
                              } else if (isThisSelected && !isThisRight) {
                                bgClass = 'bg-red-500/20 border-red-500/50 text-red-200 line-through';
                              }

                              return (
                                <div key={oIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${bgClass}`}>
                                  <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                  {isThisRight && <span className="text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded font-bold">Correct Answer</span>}
                                  {isThisSelected && !isThisRight && <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded">Your Choice</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quiz Taking View */
            mcqs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No questions added for this assessment yet.
              </div>
            ) : (
              <div>
                {/* Progress bar */}
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Question {currentIdx + 1} of {mcqs.length}</span>
                  <span>Time Left: {formatTimer(timeLeftSeconds)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mb-6 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((currentIdx + 1) / mcqs.length) * 100}%` }} />
                </div>

                {/* Question */}
                <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {currentIdx + 1}. {mcqs[currentIdx]?.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {mcqs[currentIdx]?.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(currentIdx, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-indigo-500/20 border-indigo-500 text-white font-medium shadow-md shadow-indigo-500/10' 
                            : 'bg-slate-900/50 border-slate-700/80 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {activeResult ? (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-700 bg-slate-800">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setRetaking(true);
                setUserAnswers({});
                setCurrentIdx(0);
                setTimeLeftSeconds(timeLimitMinutes * 60);
                setElapsedSeconds(0);
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Retake Assessment
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm bg-slate-700 hover:bg-slate-600 text-white font-medium"
            >
              Close
            </button>
          </div>
        ) : mcqs.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-700 bg-slate-800">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Quick jump question numbers for 10-question assessment */}
            <div className="hidden sm:flex gap-1.5 flex-wrap max-w-sm justify-center">
              {mcqs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIdx(i)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                    currentIdx === i
                      ? 'bg-indigo-500 text-white ring-2 ring-indigo-400'
                      : userAnswers[i] !== undefined
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-700/80 text-slate-400 hover:bg-slate-600'
                  }`}
                  title={`Jump to Q${i + 1}${userAnswers[i] !== undefined ? ' (Answered)' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {currentIdx < mcqs.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-5 py-2 rounded-lg text-sm bg-indigo-500 hover:bg-indigo-600 text-white font-medium"
                >
                  Next Question
                </button>
              ) : (
                <button
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="px-6 py-2 rounded-lg text-sm bg-green-500 hover:bg-green-600 text-white font-bold transition-colors shadow-lg shadow-green-500/20"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQRunnerModal;
