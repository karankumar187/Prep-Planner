import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const api = axios.create({
  baseURL: API_URL ? `${API_URL.replace(/\/$/, '')}/api` : '/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (name, email, password) => api.post('/auth/register', { name, email, password });
export const getMe = () => api.get('/auth/me');
export const updateProfile = (name) => api.put('/auth/profile', { name });
export const changePassword = (currentPassword, newPassword) => api.put('/auth/password', { currentPassword, newPassword });

// Schedules
export const getExploreSchedules = () => api.get('/schedules/explore');
export const getMySchedules = () => api.get('/schedules/my');
export const getSchedule = (id) => api.get(`/schedules/${id}`);
export const createSchedule = (data) => api.post('/schedules', data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

// Schedule Tasks
export const getScheduleTasks = (scheduleId, day) => api.get(`/schedules/${scheduleId}/tasks${day ? `?day=${day}` : ''}`);
export const addScheduleTask = (scheduleId, data) => api.post(`/schedules/${scheduleId}/tasks`, data);
export const addScheduleTasksBulk = (scheduleId, tasks) => api.post(`/schedules/${scheduleId}/tasks/bulk`, { tasks });
export const updateScheduleTask = (scheduleId, taskId, data) => api.put(`/schedules/${scheduleId}/tasks/${taskId}`, data);
export const deleteScheduleTask = (scheduleId, taskId) => api.delete(`/schedules/${scheduleId}/tasks/${taskId}`);

// Enrollments
export const getEnrollments = () => api.get('/enrollments');
export const getEnrollment = (id) => api.get(`/enrollments/${id}`);
export const createEnrollment = (data) => api.post('/enrollments', data);
export const updateEnrollment = (id, data) => api.put(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);

// Progress
export const getProgress = (enrollmentId, date) => api.get(`/progress/${enrollmentId}${date ? `?date=${date}` : ''}`);
export const toggleComplete = (scheduleTaskId, enrollmentId) => api.post('/progress/toggle', { scheduleTaskId, enrollmentId });
export const submitMCQ = (scheduleTaskId, enrollmentId, userAnswers, actualMinutes) => api.post('/progress/submit-mcq', { scheduleTaskId, enrollmentId, userAnswers, actualMinutes });
export const updateProgress = (scheduleTaskId, enrollmentId, data) => api.put('/progress', { scheduleTaskId, enrollmentId, ...data });

// Analytics
export const getOverview = (enrollmentId) => api.get(`/analytics/${enrollmentId}/overview`);
export const getCategoryAnalytics = (enrollmentId) => api.get(`/analytics/${enrollmentId}/categories`);
export const getWeeklyAnalytics = (enrollmentId, date) => api.get(`/analytics/${enrollmentId}/weekly${date ? `?date=${date}` : ''}`);
export const getStudyTimeAnalytics = (enrollmentId, date) => api.get(`/analytics/${enrollmentId}/studytime${date ? `?date=${date}` : ''}`);

// AI Generation
export const generateAIMCQs = (prompt, numQuestions, timeLimit) => api.post('/ai/generate-mcq', { prompt, numQuestions, timeLimit });

export default api;
