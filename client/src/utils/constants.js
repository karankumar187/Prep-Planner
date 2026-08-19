export const CATEGORIES = [
  'DSA', 'SQL', 'DBMS', 'OOP', 'CN', 'OS', 'Java', 'Frontend', 'Technical', 'Aptitude', 'Communication', 'Interview', 'Mock Test', 'MCQ Assessment'
];

export const CATEGORY_COLORS = {
  'DSA': '#3b82f6',
  'SQL': '#10b981',
  'DBMS': '#a855f7',
  'OOP': '#f97316',
  'CN': '#06b6d4',
  'OS': '#f43f5e',
  'Java': '#f59e0b',
  'Frontend': '#14b8a6',
  'Technical': '#0284c7',
  'Aptitude': '#84cc16',
  'Communication': '#ec4899',
  'Interview': '#8b5cf6',
  'Mock Test': '#6366f1',
  'MCQ Assessment': '#e11d48'
};

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const PRIORITY_COLORS = {
  'Low': '#22c55e',
  'Medium': '#f59e0b',
  'High': '#ef4444'
};

export const isUserCreator = (schedule, user) => {
  if (!schedule || !user) return false;
  const creatorId = schedule.creatorId?._id || schedule.creatorId || schedule.creator?._id || schedule.creator;
  const userId = user._id || user.id;
  return String(creatorId) === String(userId);
};
