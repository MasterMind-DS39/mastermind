// src/pages/categories/CategoryCreate.js
import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

// Import the CategoryForm component
import CategoryForm from '../../components/categories/CategoryForm';

function CategoryCreate() {
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
        <Typography color="text.primary">Create New</Typography>
      </Breadcrumbs>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Create New Category
        </Typography>
      </Box>
      
      {/* Category Form */}
      <CategoryForm />
    </Container>
  );
}

export default CategoryCreate;