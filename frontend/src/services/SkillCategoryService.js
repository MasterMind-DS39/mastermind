import apiClient from './apiClient';

const SKILL_CATEGORIES_URL = '/skill-categories';

export const SkillCategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await apiClient.get(SKILL_CATEGORIES_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get root categories (with no parent)
  getRootCategories: async () => {
    try {
      const response = await apiClient.get(`${SKILL_CATEGORIES_URL}/root`);
      return response.data;
    } catch (error) {
      console.error('Error fetching root categories:', error);
      throw error;
    }
  },

  // Get subcategories by parent ID
  getSubcategories: async (parentId) => {
    try {
      const response = await apiClient.get(`${SKILL_CATEGORIES_URL}/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategories for parent ${parentId}:`, error);
      throw error;
    }
  },

  // Get a single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`${SKILL_CATEGORIES_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post(SKILL_CATEGORIES_URL, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update an existing category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`${SKILL_CATEGORIES_URL}/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      await apiClient.delete(`${SKILL_CATEGORIES_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Check if category name exists
  categoryExists: async (name) => {
    try {
      const response = await apiClient.get(`${SKILL_CATEGORIES_URL}/exists/${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error checking if category ${name} exists:`, error);
      throw error;
    }
  }
};

export default SkillCategoryService;