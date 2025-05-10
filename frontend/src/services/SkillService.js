// src/services/SkillService.js
import apiClient from './apiClient';

const SKILLS_URL = '/skills';

export const SkillService = {
  // Get all skills with pagination
  getAllSkills: async (page = 0, size = 10, sortBy = 'name', direction = 'asc') => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}`, {
        params: { page, size, sortBy, direction }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  // Get a single skill by ID
  getSkillById: async (id) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill ${id}:`, error);
      throw error;
    }
  },

  // Get skills by category
  getSkillsByCategory: async (categoryId, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/category/${categoryId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching skills for category ${categoryId}:`, error);
      throw error;
    }
  },

  // Get skills by difficulty level
  getSkillsByDifficulty: async (level, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/difficulty/${level}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching skills with difficulty ${level}:`, error);
      throw error;
    }
  },

  // Search skills
  searchSkills: async (keyword, page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/search`, {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching skills with keyword "${keyword}":`, error);
      throw error;
    }
  },

  // Get trending skills
  getTrendingSkills: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/trending`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending skills:', error);
      throw error;
    }
  },

  // Get popular skills
  getPopularSkills: async (page = 0, size = 10) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/popular`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular skills:', error);
      throw error;
    }
  },

  // Create a new skill
  createSkill: async (skillData) => {
    try {
      const response = await apiClient.post(SKILLS_URL, skillData);
      return response.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // Update an existing skill
  updateSkill: async (id, skillData) => {
    try {
      const response = await apiClient.put(`${SKILLS_URL}/${id}`, skillData);
      return response.data;
    } catch (error) {
      console.error(`Error updating skill ${id}:`, error);
      throw error;
    }
  },

  // Delete a skill
  deleteSkill: async (id) => {
    try {
      await apiClient.delete(`${SKILLS_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting skill ${id}:`, error);
      throw error;
    }
  },

  // Get prerequisite skills
  getPrerequisiteSkills: async (skillId) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/${skillId}/prerequisites`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prerequisites for skill ${skillId}:`, error);
      throw error;
    }
  },

  // Get related skills
  getRelatedSkills: async (skillId) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/${skillId}/related`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching related skills for skill ${skillId}:`, error);
      throw error;
    }
  },

  // Add prerequisite to skill
  addPrerequisite: async (skillId, prerequisiteId) => {
    try {
      await apiClient.post(`${SKILLS_URL}/${skillId}/prerequisites/${prerequisiteId}`);
    } catch (error) {
      console.error(`Error adding prerequisite ${prerequisiteId} to skill ${skillId}:`, error);
      throw error;
    }
  },

  // Remove prerequisite from skill
  removePrerequisite: async (skillId, prerequisiteId) => {
    try {
      await apiClient.delete(`${SKILLS_URL}/${skillId}/prerequisites/${prerequisiteId}`);
    } catch (error) {
      console.error(`Error removing prerequisite ${prerequisiteId} from skill ${skillId}:`, error);
      throw error;
    }
  },

  // Get tags for skill
  getTagsForSkill: async (skillId) => {
    try {
      const response = await apiClient.get(`${SKILLS_URL}/${skillId}/tags`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tags for skill ${skillId}:`, error);
      throw error;
    }
  },

  // Add tag to skill
  addTagToSkill: async (skillId, tagName) => {
    try {
      await apiClient.post(`${SKILLS_URL}/${skillId}/tags/${encodeURIComponent(tagName)}`);
    } catch (error) {
      console.error(`Error adding tag ${tagName} to skill ${skillId}:`, error);
      throw error;
    }
  },

  // Remove tag from skill
  removeTagFromSkill: async (skillId, tagName) => {
    try {
      await apiClient.delete(`${SKILLS_URL}/${skillId}/tags/${encodeURIComponent(tagName)}`);
    } catch (error) {
      console.error(`Error removing tag ${tagName} from skill ${skillId}:`, error);
      throw error;
    }
  }
};

export default SkillService;