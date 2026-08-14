import { supabase, toCamelCase } from './apiClient';

export const statisticsApi = {
  getStatistics: async () => {
    const { data, error } = await supabase.from('statistics').select('*').maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return {
      totalSubjects: 0, totalLessons: 0, completedLessons: 0, overallProgress: 0,
      totalStudyTime: 0, totalReviews: 0, quizAverage: 0, studyStreak: 0,
      weeklyStudyTime: [], monthlyProgress: [], quizScores: [], dailyStudyTime: [],
    };
    return toCamelCase(data);
  },

  getWeeklyReport: async () => {
    return { lessonsStudied: 0, studyHours: 0, reviewsCount: 0, quizAverage: 0 };
  },

  getMonthlyReport: async () => {
    return { lessonsStudied: 0, studyHours: 0, reviewsCount: 0, quizAverage: 0 };
  },
};
