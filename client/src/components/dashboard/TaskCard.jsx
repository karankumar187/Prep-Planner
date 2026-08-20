import React, { useState } from 'react';
import { Pencil, Trash2, Clock, Check, HelpCircle, Trophy, ExternalLink, BookOpen } from 'lucide-react';
import CategoryPill from '../shared/CategoryPill';
import { PRIORITY_COLORS } from '../../utils/constants';
import MCQRunnerModal from './MCQRunnerModal';
import ReadingMaterialModal from './ReadingMaterialModal';

const TaskCard = ({ task, enrollmentId, onToggleComplete, onEdit, onDelete, onMCQSubmitted }) => {
  const [actualTime, setActualTime] = useState('');
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [isMCQOpen, setIsMCQOpen] = useState(false);
  const [isReadingOpen, setIsReadingOpen] = useState(false);

  const isCompleted = task.completed;
  const pColor = PRIORITY_COLORS[task.scheduleTask.priority] || PRIORITY_COLORS['Medium'];
  const hasMCQs = task.scheduleTask.mcqs && task.scheduleTask.mcqs.length > 0;
  const hasReading = task.scheduleTask.taskType === 'reading' || !!task.scheduleTask.readingContent;
  const mcqScore = task.mcqScore;
  const resourceLink = task.scheduleTask.link;

  const handleToggle = () => {
    // If it's a Reading Material task, force opening the reader modal
    if (hasReading && !isCompleted) {
      setIsReadingOpen(true);
      return;
    }
    // If it's an MCQ Quiz task, force opening the quiz runner
    if (hasMCQs && !isCompleted) {
      setIsMCQOpen(true);
      return;
    }

    // Standard task toggle
    if (!isCompleted) {
      setShowTimeInput(true);
    } else {
      onToggleComplete(task.scheduleTask._id);
    }
  };

  const submitTime = () => {
    onToggleComplete(task.scheduleTask._id, Number(actualTime) || task.scheduleTask.estimatedMinutes);
    setShowTimeInput(false);
    setActualTime('');
  };

  return (
    <>
      <div className={`group relative bg-slate-800/85 hover:bg-slate-750/90 border rounded-xl p-3 flex items-center justify-between gap-3 transition-all duration-200 shadow-sm ${
        isCompleted 
          ? 'border-emerald-500/25 bg-slate-850/40 opacity-75' 
          : 'border-slate-700/70 hover:border-slate-600 hover:shadow-md'
      }`}>
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Minimal Custom Checkbox */}
          <button 
            type="button"
            onClick={handleToggle}
            className={`w-5 h-5 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-150 flex-shrink-0 mt-0.5 ${
              isCompleted 
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/40' 
                : 'border-slate-600 bg-slate-900/60 hover:border-indigo-400 hover:bg-indigo-500/10'
            }`}
            title={hasReading ? "Open & read study material to complete" : hasMCQs ? "Take quiz to complete" : "Toggle task completion"}
          >
            {isCompleted && <Check size={12} className="stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            {/* Title & Category Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-sm font-semibold tracking-tight transition-colors ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-100 group-hover:text-white'
              }`}>
                {task.scheduleTask.title}
              </h4>
              
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: pColor }} 
                title={`Priority: ${task.scheduleTask.priority}`} 
              />

              <CategoryPill category={task.scheduleTask.category} />

              {/* Resource Link Badge */}
              {resourceLink && (
                <a
                  href={resourceLink.startsWith('http') ? resourceLink : `https://${resourceLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                  title="Open resource link"
                >
                  <span>Link</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>

            {/* Sub-info Row: Time, Reading, & Quiz Badges */}
            <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock size={11} className="text-slate-400" />
                <span>{task.scheduleTask.estimatedMinutes}m est.</span>
              </div>

              {isCompleted && task.actualMinutes && (
                <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <Clock size={10} />
                  <span>{task.actualMinutes}m actual</span>
                </div>
              )}

              {/* Reading Material Button */}
              {hasReading && (
                <button
                  type="button"
                  onClick={() => setIsReadingOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-colors"
                >
                  <BookOpen size={11} className="text-purple-400" />
                  <span>Study Notes</span>
                </button>
              )}

              {/* MCQ Assessment Quiz Button */}
              {hasMCQs && (
                <button
                  type="button"
                  onClick={() => setIsMCQOpen(true)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                    mcqScore && mcqScore.total > 0
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                  }`}
                >
                  {mcqScore && mcqScore.total > 0 ? (
                    <>
                      <Trophy size={11} className="text-emerald-400" />
                      <span>Quiz: {mcqScore.score}/{mcqScore.total} ({mcqScore.percentage}%)</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle size={11} className="text-rose-400" />
                      <span>Take Quiz ({task.scheduleTask.mcqs.length} Qs)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* In-line Actual Time Prompt */}
            {showTimeInput && (
              <div className="mt-2.5 p-2 bg-slate-900/80 rounded-lg border border-slate-700/80 flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Actual study time:</span>
                <input 
                  type="number" 
                  placeholder={`${task.scheduleTask.estimatedMinutes} mins`}
                  className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white w-24 outline-none focus:border-indigo-500"
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={submitTime} 
                  className="bg-indigo-600 text-white px-2.5 py-1 rounded text-xs hover:bg-indigo-500 font-semibold transition-colors"
                >
                  Save
                </button>
                <button 
                  type="button"
                  onClick={() => setShowTimeInput(false)} 
                  className="text-slate-400 hover:text-white px-1.5 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 flex-shrink-0 self-center">
            {onEdit && (
              <button 
                type="button"
                onClick={() => onEdit(task.scheduleTask)} 
                className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-700/60 transition-colors" 
                title="Edit Item"
              >
                <Pencil size={13} />
              </button>
            )}
            {onDelete && (
              <button 
                type="button"
                onClick={() => onDelete(task.scheduleTask._id)} 
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-700/60 transition-colors" 
                title="Delete Item"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <MCQRunnerModal
        isOpen={isMCQOpen}
        onClose={() => setIsMCQOpen(false)}
        task={task}
        enrollmentId={enrollmentId}
        onSubmitted={() => {
          setIsMCQOpen(false);
          if (onMCQSubmitted) onMCQSubmitted();
        }}
      />

      <ReadingMaterialModal
        isOpen={isReadingOpen}
        onClose={() => setIsReadingOpen(false)}
        task={task}
        enrollmentId={enrollmentId}
        onToggleComplete={onToggleComplete}
      />
    </>
  );
};

export default TaskCard;
