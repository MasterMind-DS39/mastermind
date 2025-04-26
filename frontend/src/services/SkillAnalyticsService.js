import apiClient from './apiClient';

const ANALYTICS_URL = '/skill-analytics';

export const SkillAnalyticsService = {
  // Recalculate popularity score for a skill
  recalculateSkillPopularity: async (skillId) => {
    try {
      await apiClient.post(`${ANALYTICS_URL}/recalculate/${skillId}`);
    } catch (error) {
      console.error(`Error recalculating popularity for skill ${skillId}:`, error);
      throw error;
    }
  },

  // Identify trending skills
  identifyTrendingSkills: async () => {
    try {
      const response = await apiClient.post(`${ANALYTICS_URL}/identify-trending`);
      return response.data;
    } catch (error) {
      console.error('Error identifying trending skills:', error);
      throw error;
    }
  },

  // Get trending skills with pagination
  getTrendingSkills: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${ANALYTICS_URL}/trending`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending skills:', error);
      throw error;
    }
  },

  // Track skill usage
  trackSkillUsage: async (skillId) => {
    try {
      await apiClient.post(`${ANALYTICS_URL}/track-usage/${skillId}`);
    } catch (error) {
      console.error(`Error tracking usage for skill ${skillId}:`, error);
      throw error;
    }
  },

  // Get most frequent tags
  getMostFrequentTags: async (limit = 10) => {
    try {
      const response = await apiClient.get(`${ANALYTICS_URL}/tags/most-frequent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching most frequent tags:', error);
      throw error;
    }
  },

  // Get popularity by category
  getPopularityByCategory: async () => {
    try {
      const response = await apiClient.get(`${ANALYTICS_URL}/popularity-by-category`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popularity by category:', error);
      throw error;
    }
  },

  // Get skill distribution by difficulty
  getSkillDistributionByDifficulty: async () => {
    try {
      const response = await apiClient.get(`${ANALYTICS_URL}/distribution-by-difficulty`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skill distribution by difficulty:', error);
      throw error;
    }
  }
};

export default SkillAnalyticsService;