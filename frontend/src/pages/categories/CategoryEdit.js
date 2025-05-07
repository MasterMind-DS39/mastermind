// src/pages/categories/CategoryEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkillCategoryService } from '../../services/SkillCategoryService';
import { TextField, Button, CircularProgress, Box, Typography, Paper } from '@mui/material';

const CategoryEdit = () => {
  const { id } = useParams(); // Get category ID from URL
  const navigate = useNavigate();

  const [category, setCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await SkillCategoryService.getCategoryById(id);
        setCategory(data);
      } catch (error) {
        setError('Error fetching category details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      await SkillCategoryService.updateCategory(id, category);
      navigate(`/categories/${id}`); // Redirect to category detail page after update
    } catch (error) {
      setError('Error updating category.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper sx={{ padding: '20px' }}>
        <Typography variant="h4">Edit Category</Typography>

        {error && (
          <Typography variant="body1" color="error" sx={{ marginBottom: '20px' }}>
            {error}
          </Typography>
        )}

        <TextField
          label="Category Name"
          name="name"
          value={category.name}
          onChange={handleInputChange}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />

        <TextField
          label="Category Description"
          name="description"
          value={category.description}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: '20px' }}
        />

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CategoryEdit;