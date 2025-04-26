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
  Chip,
  Paper,
  Typography,
  Grid,
  Autocomplete,
  FormHelperText,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import SkillService from '../../services/SkillService';
import SkillCategoryService from '../../services/SkillCategoryService';
import SkillAnalyticsService from '../../services/SkillAnalyticsService';

// Difficulty levels
const difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const SkillForm = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficultyLevel: 'BEGINNER',
    categoryId: '',
    prerequisiteIds: [],
    relatedSkillIds: [],
    tags: []
  });
  
  // Options for selects
  const [categories, setCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Tag input
  const [tagInput, setTagInput] = useState('');
  
  // Fetch categories and skills for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesData = await SkillCategoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Fetch all skills for prerequisites/related
        if (isEditing) {
          const skillsResponse = await SkillService.getAllSkills(0, 1000);
          // Filter out the current skill being edited
          const filteredSkills = skillsResponse.content.filter(
            skill => skill.id !== initialData?.id
          );
          setAllSkills(filteredSkills);
        } else {
          const skillsResponse = await SkillService.getAllSkills(0, 1000);
          setAllSkills(skillsResponse.content);
        }
        
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isEditing, initialData]);
  
  // Set initial form data if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        difficultyLevel: initialData.difficultyLevel || 'BEGINNER',
        categoryId: initialData.categoryId || '',
        prerequisiteIds: initialData.prerequisiteIds || [],
        relatedSkillIds: initialData.relatedSkillIds || [],
        tags: initialData.tags || []
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
  
  // Handle multi-select changes (prerequisites and related skills)
  const handleMultiSelectChange = (field, values) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      if (isEditing) {
        await SkillService.updateSkill(initialData.id, formData);
      } else {
        await SkillService.createSkill(formData);
      }
      
      // Navigate back to skills list on success
      navigate('/skills');
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to save skill. Please try again.');
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
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Skill Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              disabled={submitting}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                label="Category"
                disabled={submitting}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl fullWidth required>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                label="Difficulty Level"
                disabled={submitting}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Tags
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <TextField
                label="Add Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                variant="outlined"
                size="small"
                disabled={submitting}
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || submitting}
                startIcon={<LocalOfferIcon />}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  disabled={submitting}
                />
              ))}
              {formData.tags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No tags added yet. Tags help users find this skill more easily.
                </Typography>
              )}
            </Box>
          </Grid>
          
          {/* Relationships */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Skill Relationships
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={allSkills}
              getOptionLabel={(option) => option.name}
              value={allSkills.filter(skill => 
                formData.prerequisiteIds.includes(skill.id)
              )}
              onChange={(event, newValue) => {
                handleMultiSelectChange(
                  'prerequisiteIds', 
                  newValue.map(skill => skill.id)
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Prerequisite Skills"
                  placeholder="Select prerequisites"
                />
              )}
              disabled={submitting}
            />
            <FormHelperText>
              Skills that should be learned before this one
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={allSkills}
              getOptionLabel={(option) => option.name}
              value={allSkills.filter(skill => 
                formData.relatedSkillIds.includes(skill.id)
              )}
              onChange={(event, newValue) => {
                handleMultiSelectChange(
                  'relatedSkillIds', 
                  newValue.map(skill => skill.id)
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Related Skills"
                  placeholder="Select related skills"
                />
              )}
              disabled={submitting}
            />
            <FormHelperText>
              Skills that are related or complementary to this one
            </FormHelperText>
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/skills')}
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
              {submitting ? 'Saving...' : (isEditing ? 'Update Skill' : 'Create Skill')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SkillForm;