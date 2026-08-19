import React, { createContext, useState, useEffect, useContext } from 'react';
import { getEnrollments } from '../utils/api';
import { AuthContext } from './AuthContext';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize enrollment data: backend populates scheduleId,
  // but frontend components expect enrollment.schedule
  const normalizeEnrollment = (enrollment) => ({
    ...enrollment,
    schedule: enrollment.scheduleId || enrollment.schedule
  });

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await getEnrollments();
      const normalized = data.map(normalizeEnrollment);
      setEnrollments(normalized);

      const savedId = localStorage.getItem('selectedEnrollment');
      if (savedId) {
        const found = normalized.find(e => e._id === savedId);
        if (found) setSelectedEnrollment(found);
        else if (normalized.length > 0) setSelectedEnrollment(normalized[0]);
      } else if (normalized.length > 0) {
        setSelectedEnrollment(normalized[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    } else {
      setEnrollments([]);
      setSelectedEnrollment(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (selectedEnrollment) {
      localStorage.setItem('selectedEnrollment', selectedEnrollment._id);
    }
  }, [selectedEnrollment]);

  return (
    <AppContext.Provider value={{
      enrollments,
      selectedEnrollment,
      setSelectedEnrollment,
      refreshEnrollments: fetchEnrollments,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
};
