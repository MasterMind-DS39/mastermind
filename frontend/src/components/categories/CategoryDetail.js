// src/pages/categories/CategoryDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';
import CategoryIcon from '@mui/icons-material/Category';
import PsychologyIcon from '@mui/icons-material/Psychology';

import SkillCategoryService from 'services/SkillCategoryService';
import SkillService from 'services/SkillService';

function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Fetch category data
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main category data
        const categoryData = await SkillCategoryService.getCategoryById(id);
        setCategory(categoryData);
        
        // Fetch subcategories
        const subcategoriesData = await SkillCategoryService.getSubcategories(id);
        setSubCategories(subcategoriesData);
        
        // Fetch skills in this category
        const skillsData = await SkillService.getSkillsByCategory(id, 0, 100);
        setSkills(skillsData.content || []);
        
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCategoryData();
    }
  }, [id]);
  
  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      await SkillCategoryService.deleteCategory(id);
      navigate('/categories');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
      setDeleteDialogOpen(false);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/categories"
          sx={{ mt: 2 }}
        >
          Back to Categories
        </Button>
      </Container>
    );
  }
  
  if (!category) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          Category not found.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/categories"
          sx={{ mt: 2 }}
        >
          Back to Categories
        </Button>
      </Container>
    );
  }
  
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
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>
      
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {category.name}
        </Typography>
        
        <Box>
          <Button
            component={RouterLink}
            to="/categories"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          
          <Button
            component={RouterLink}
            to={`/categories/${id}/edit`}
            startIcon={<EditIcon />}
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              {category.parentCategoryId && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Parent Category
                  </Typography>
                  <Typography variant="body1" component={RouterLink} to={`/categories/${category.parentCategoryId}`} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    {category.parentCategoryName}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {category.description || 'No description provided.'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Subcategories Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Subcategories
              </Typography>
            </Box>
            
            {subCategories.length > 0 ? (
              <Grid container spacing={2}>
                {subCategories.map((subcat) => (
                  <Grid item xs={12} sm={6} md={4} key={subcat.id}>
                    <Card 
                      variant="outlined"
                      component={RouterLink}
                      to={`/categories/${subcat.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" component="div">
                          {subcat.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {subcat.description && subcat.description.length > 60 
                            ? `${subcat.description.substring(0, 60)}...` 
                            : subcat.description || 'No description'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No subcategories found.
              </Typography>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/categories/create"
                startIcon={<CategoryIcon />}
              >
                Add New Subcategory
              </Button>
            </Box>
          </Paper>
          
          {/* Skills in Category Section */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PsychologyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Skills in this Category
              </Typography>
            </Box>
            
            {skills.length > 0 ? (
              <Grid container spacing={2}>
                {skills.map((skill) => (
                  <Grid item xs={12} sm={6} md={4} key={skill.id}>
                    <Card 
                      variant="outlined"
                      component={RouterLink}
                      to={`/skills/${skill.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" component="div">
                          {skill.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={skill.difficultyLevel} 
                          color={
                            skill.difficultyLevel === 'BEGINNER' ? 'success' :
                            skill.difficultyLevel === 'INTERMEDIATE' ? 'info' :
                            skill.difficultyLevel === 'ADVANCED' ? 'warning' : 'error'
                          }
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No skills found in this category.
              </Typography>
            )}
            
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/skills/create"
                startIcon={<PsychologyIcon />}
              >
                Add New Skill
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Additional Info */}
        <Grid item xs={12} md={4}>
          {/* Category Image */}
          {category.iconUrl && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category Image
              </Typography>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  borderRadius: 1,
                }}
                src={category.iconUrl}
                alt={category.name}
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/300"; // Fallback image
                }}
              />
            </Paper>
          )}
          
          {/* Stats Card */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Subcategories
              </Typography>
              <Typography variant="h4">
                {subCategories.length}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Skills
              </Typography>
              <Typography variant="h4">
                {skills.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
            {(subCategories.length > 0 || skills.length > 0) && (
              <Box sx={{ mt: 2, color: 'error.main' }}>
                Warning: This category contains {subCategories.length} subcategories and {skills.length} skills. 
                Deleting it may affect these items.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CategoryDetail;