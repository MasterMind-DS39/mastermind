// src/pages/categories/CategoryEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import CategoryForm from '../../components/categories/CategoryForm';
import SkillCategoryService from 'services/SkillCategoryService';

function CategoryEdit() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await SkillCategoryService.getCategoryById(id);
        setCategory(data);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  return (
    <Container>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/categories" color="inherit">
          Categories
        </Link>
        {!loading && category && (
          <Link component={RouterLink} to={`/categories/${id}`} color="inherit">
            {category.name}
          </Link>
        )}
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Edit Category {category?.name && `- ${category.name}`}
        </Typography>
      </Box>
      
      {/* Loading and Error States */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : category ? (
        /* Category Form */
        <CategoryForm initialData={category} isEditing={true} />
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          Category not found.
        </Alert>
      )}
    </Container>
  );
}

export default CategoryEdit;