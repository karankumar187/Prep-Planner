import React from 'react';
import { Trophy, CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import CategoryPill from '../shared/CategoryPill';

const QuizPerformanceCard = ({ quizStats }) => {
  const history = quizStats?.history || [];
  const quizzesTaken = quizStats?.quizzesTaken || 0;
  const averageAccuracy = quizStats?.averageAccuracy || 0;
  const totalScore = quizStats?.totalScore || 0;
  const totalQuestions = quizStats?.totalQuestions || 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            <Trophy size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Assessment & Quiz Performance</h3>
            <p className="text-xs text-slate-400">Detailed scorecard and accuracy across all 10-MCQ assessments</p>
          </div>
        </div>

        {quizzesTaken > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">Avg Accuracy: </span>
              <strong className={`font-bold ${
                averageAccuracy >= 80 ? 'text-emerald-400' : averageAccuracy >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {averageAccuracy}%
              </strong>
            </div>

            <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">Total Solved: </span>
              <strong className="text-white font-bold">{totalScore} / {totalQuestions}</strong>
            </div>

            <div className="bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400">Completed: </span>
              <strong className="text-indigo-400 font-bold">{quizzesTaken}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Body: Table or Empty State */}
      {history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Assessment Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Day</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-center">Accuracy</th>
                <th className="py-3 px-3 text-center">Time Spent</th>
                <th className="py-3 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750">
              {history.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-750/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-white max-w-xs truncate">
                    {q.title}
                  </td>
                  <td className="py-3 px-3">
                    <CategoryPill category={q.category} />
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-xs text-slate-400">
                    Day {q.dayNumber}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-white">
                    {q.score} / {q.total}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                      q.percentage >= 80 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : q.percentage >= 60 
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {q.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-xs font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="text-slate-500" />
                      {q.quizMinutes ? `${q.quizMinutes}m` : '< 1m'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-xs text-slate-400">
                    {q.completedAt ? format(new Date(q.completedAt), 'MMM d, yyyy') : 'Recently'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/40 rounded-xl p-8 text-center border border-slate-700/60 flex flex-col items-center justify-center space-y-2.5">
          <div className="p-3 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
            <Trophy size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-200">No Assessment Marks Recorded Yet</h4>
          <p className="text-xs text-slate-400 max-w-md">
            Complete reading materials on your Dashboard and take the 10-MCQ quizzes (40 min timer). Your assessment marks, score breakdown, and accuracy metrics will automatically appear here!
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPerformanceCard;
