import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import OverviewStats from '../components/analytics/OverviewStats';
import DailyProgressChart from '../components/analytics/DailyProgressChart';
import CategoryDonutChart from '../components/analytics/CategoryDonutChart';
import StudyTimeTrend from '../components/analytics/StudyTimeTrend';
import { getOverview, getCategoryAnalytics, getWeeklyAnalytics, getStudyTimeAnalytics } from '../utils/api';

const Analytics = () => {
  const { selectedEnrollment } = useContext(AppContext);
  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [studyData, setStudyData] = useState([]);

  useEffect(() => {
    if (selectedEnrollment) {
      const id = selectedEnrollment._id;
      getOverview(id).then(res => setStats(res.data)).catch(console.error);
      getCategoryAnalytics(id).then(res => setCategoryData(res.data)).catch(console.error);
      getWeeklyAnalytics(id).then(res => setWeeklyData(res.data)).catch(console.error);
      getStudyTimeAnalytics(id).then(res => setStudyData(res.data)).catch(console.error);
    }
  }, [selectedEnrollment]);

  if (!selectedEnrollment) return <div className="text-white">Please select a schedule.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
      </div>

      <OverviewStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <DailyProgressChart data={weeklyData} />
        <CategoryDonutChart data={categoryData} />
        <div className="lg:col-span-2">
          <StudyTimeTrend data={studyData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
