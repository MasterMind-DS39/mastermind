// src/pages/skills/SkillDetail.js
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
  Chip,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import SkillService from '../../services/SkillService';
import SkillCategoryService from '../../services/SkillCategoryService';
import SkillAnalyticsService from '../../services/SkillAnalyticsService';

function SkillDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [skill, setSkill] = useState(null);
  const [prerequisites, setPrerequisites] = useState([]);
  const [relatedSkills, setRelatedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Track skill view (analytics)
  useEffect(() => {
    if (id) {
      const trackView = async () => {
        try {
          await SkillAnalyticsService.trackSkillUsage(id);
        } catch (err) {
          console.error('Error tracking skill view:', err);
          // Non-critical error, don't show to user
        }
      };
      
      trackView();
    }
  }, [id]);
  
  // Fetch skill data
  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch main skill data
        const skillData = await SkillService.getSkillById(id);
        setSkill(skillData);
        
        // Fetch prerequisites
        const prerequisitesData = await SkillService.getPrerequisiteSkills(id);
        setPrerequisites(prerequisitesData);
        
        // Fetch related skills
        const relatedData = await SkillService.getRelatedSkills(id);
        setRelatedSkills(relatedData);
        
      } catch (err) {
        console.error('Error fetching skill data:', err);
        setError('Failed to load skill. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchSkillData();
    }
  }, [id]);
  
  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      await SkillService.deleteSkill(id);
      navigate('/skills');
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill. Please try again.');
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
          to="/skills"
          sx={{ mt: 2 }}
        >
          Back to Skills
        </Button>
      </Container>
    );
  }
  
  if (!skill) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          Skill not found.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          component={RouterLink}
          to="/skills"
          sx={{ mt: 2 }}
        >
          Back to Skills
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
        <Link component={RouterLink} to="/skills" color="inherit">
          Skills
        </Link>
        <Typography color="text.primary">{skill.name}</Typography>
      </Breadcrumbs>
      
      {/* Header with Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {skill.name}
          {skill.isTrending && (
            <Tooltip title="Trending Skill">
              <TrendingUpIcon color="error" sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
        
        <Box>
          <Button
            component={RouterLink}
            to="/skills"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          
          <Button
            component={RouterLink}
            to={`/skills/${id}/edit`}
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
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {skill.categoryName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Difficulty Level
                </Typography>
                <Chip 
                  label={skill.difficultyLevel} 
                  color={
                    skill.difficultyLevel === 'BEGINNER' ? 'success' :
                    skill.difficultyLevel === 'INTERMEDIATE' ? 'info' :
                    skill.difficultyLevel === 'ADVANCED' ? 'warning' : 'error'
                  }
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {skill.description || 'No description provided.'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalOfferIcon sx={{ mr: 1, color: 'secondary.main' }} fontSize="small" />
                  <Typography variant="subtitle1">
                    Tags
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skill.tags && skill.tags.length > 0 ? (
                    skill.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tags assigned to this skill.
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Prerequisites Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Prerequisites
              </Typography>
            </Box>
            
            {prerequisites.length > 0 ? (
              <Grid container spacing={2}>
                {prerequisites.map((prereq) => (
                  <Grid item xs={12} sm={6} md={4} key={prereq.id}>
                    <Card 
                      variant="outlined"
                      component={RouterLink}
                      to={`/skills/${prereq.id}`}
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
                          {prereq.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={prereq.difficultyLevel} 
                          color={
                            prereq.difficultyLevel === 'BEGINNER' ? 'success' :
                            prereq.difficultyLevel === 'INTERMEDIATE' ? 'info' :
                            prereq.difficultyLevel === 'ADVANCED' ? 'warning' : 'error'
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
                No prerequisites required for this skill.
              </Typography>
            )}
          </Paper>
          
          {/* Related Skills Section */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Related Skills
              </Typography>
            </Box>
            
            {relatedSkills.length > 0 ? (
              <Grid container spacing={2}>
                {relatedSkills.map((related) => (
                  <Grid item xs={12} sm={6} md={4} key={related.id}>
                    <Card 
                      variant="outlined"
                      component={RouterLink}
                      to={`/skills/${related.id}`}
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
                          {related.name}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={related.difficultyLevel} 
                          color={
                            related.difficultyLevel === 'BEGINNER' ? 'success' :
                            related.difficultyLevel === 'INTERMEDIATE' ? 'info' :
                            related.difficultyLevel === 'ADVANCED' ? 'warning' : 'error'
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
                No related skills defined for this skill.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column - Analytics & Info Cards */}
        <Grid item xs={12} md={4}>
          {/* Popularity Card */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Analytics
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Popularity Score
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between'
              }}>
                <Typography variant="h4" color="primary">
                  {skill.popularityScore ? skill.popularityScore.toFixed(1) : '0.0'}
                </Typography>
                {skill.isTrending && (
                  <Chip 
                    icon={<TrendingUpIcon />} 
                    label="Trending" 
                    color="error" 
                    size="small"
                  />
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Usage Count
              </Typography>
              <Typography variant="h5">
                {skill.usageCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                times this skill has been accessed
              </Typography>
            </Box>
          </Paper>
          
          {/* Actions Card */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookmarkIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Quick Actions
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<SchoolIcon />}
                component={RouterLink}
                to="/skills/create"
              >
                Create New Skill
              </Button>
              
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<TrendingUpIcon />}
                onClick={async () => {
                  try {
                    await SkillAnalyticsService.recalculateSkillPopularity(id);
                    // Refresh the page to show updated score
                    window.location.reload();
                  } catch (err) {
                    console.error('Error recalculating popularity:', err);
                    setError('Failed to recalculate popularity score.');
                  }
                }}
              >
                Recalculate Popularity
              </Button>
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
            Are you sure you want to delete the skill "{skill.name}"? This action cannot be undone.
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

export default SkillDetail;