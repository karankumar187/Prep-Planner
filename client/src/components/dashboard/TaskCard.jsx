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
      <div className={`group bg-slate-800/90 border rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 transition-all duration-150 ${
        isCompleted ? 'border-green-500/20 bg-slate-800/40 opacity-70' : 'border-slate-700/80 hover:border-slate-600'
      }`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Compact Checkbox */}
          <div 
            onClick={handleToggle}
            className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${
              isCompleted ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-indigo-400'
            }`}
            title={hasReading ? "Open & read study material to complete" : hasMCQs ? "Take quiz to complete" : "Toggle task completion"}
          >
            {isCompleted && <Check size={12} className="text-white" />}
          </div>

          <div className="min-w-0 flex-1">
            {/* Title Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-sm font-medium text-slate-100 truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                {task.scheduleTask.title}
              </h4>
              
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pColor }} title={`Priority: ${task.scheduleTask.priority}`} />

              <CategoryPill category={task.scheduleTask.category} />

              {/* Resource Link Badge */}
              {resourceLink && (
                <a
                  href={resourceLink.startsWith('http') ? resourceLink : `https://${resourceLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                  title="Open resource link"
                >
                  <span>Link</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>

            {/* Sub-info Row: Time, Reading, & Quiz */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{task.scheduleTask.estimatedMinutes}m est.</span>
              </div>

              {isCompleted && task.actualMinutes && (
                <div className="flex items-center gap-1 text-green-400 font-medium">
                  <Clock size={12} />
                  <span>{task.actualMinutes}m actual</span>
                </div>
              )}

              {/* Reading Material Button */}
              {hasReading && (
                <button
                  onClick={() => setIsReadingOpen(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-colors"
                >
                  <BookOpen size={11} className="text-purple-400" />
                  <span>Read Study Material</span>
                </button>
              )}

              {/* MCQ Assessment Quiz Button */}
              {hasMCQs && (
                <button
                  onClick={() => setIsMCQOpen(true)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    mcqScore && mcqScore.total > 0
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                  }`}
                >
                  {mcqScore && mcqScore.total > 0 ? (
                    <>
                      <Trophy size={11} className="text-emerald-400" />
                      <span>Score: {mcqScore.score}/{mcqScore.total} ({mcqScore.percentage}%)</span>
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

            {showTimeInput && (
              <div className="mt-2 flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Actual mins"
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-0.5 text-xs text-white w-28"
                  value={actualTime}
                  onChange={(e) => setActualTime(e.target.value)}
                  autoFocus
                />
                <button onClick={submitTime} className="bg-indigo-500 text-white px-2 py-0.5 rounded text-xs hover:bg-indigo-600 font-medium">
                  Done
                </button>
                <button onClick={() => setShowTimeInput(false)} className="text-slate-400 hover:text-white px-1 text-xs">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-1 flex-shrink-0">
            {onEdit && (
              <button onClick={() => onEdit(task.scheduleTask)} className="p-1 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-700/60 transition-colors" title="Edit Item">
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(task.scheduleTask._id)} className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700/60 transition-colors" title="Delete Item">
                <Trash2 size={14} />
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
