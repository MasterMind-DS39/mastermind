// src/components/categories/CategoryForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import SkillCategoryService from '../../services/SkillCategoryService';

const CategoryForm = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconUrl: '',
    parentCategoryId: ''
  });
  
  // Options for parent category select
  const [categories, setCategories] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch categories for parent category dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await SkillCategoryService.getAllCategories();
        
        // Filter out the current category if editing (to prevent self-reference)
        const filteredCategories = isEditing 
          ? result.filter(cat => cat.id !== initialData?.id)
          : result;
          
        setCategories(filteredCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [isEditing, initialData]);
  
  // Set initial form data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        iconUrl: initialData.iconUrl || '',
        parentCategoryId: initialData.parentCategoryId || ''
      });
    }
  }, [isEditing, initialData]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditing) {
        await SkillCategoryService.updateCategory(initialData.id, formData);
      } else {
        await SkillCategoryService.createCategory(formData);
      }
      
      // Navigate back to categories list on success
      navigate('/categories');
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to save category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Category Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Category Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              disabled={submitting}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              disabled={submitting}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Icon URL"
              name="iconUrl"
              value={formData.iconUrl}
              onChange={handleChange}
              variant="outlined"
              helperText="URL to an image representing this category"
              disabled={submitting}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Parent Category</InputLabel>
              <Select
                name="parentCategoryId"
                value={formData.parentCategoryId}
                onChange={handleChange}
                label="Parent Category"
                disabled={submitting}
              >
                <MenuItem value="">
                  <em>None (Root Category)</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/categories')}
              startIcon={<CancelIcon />}
              sx={{ mr: 2 }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CategoryForm;