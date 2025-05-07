// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExploreIcon from '@mui/icons-material/Explore';
import CategoryIcon from '@mui/icons-material/Category';

import SkillService from '../services/SkillService';
import SkillCategoryService from '../services/SkillCategoryService';
import SkillAnalyticsService from '../services/SkillAnalyticsService';

function Home() {
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch trending skills
        const trendsResponse = await SkillService.getTrendingSkills(0, 6);
        setTrendingSkills(trendsResponse.content || []);
        
        // Fetch root categories
        const categoriesResponse = await SkillCategoryService.getRootCategories();
        setPopularCategories(categoriesResponse.slice(0, 6) || []);
        
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            MasterMind
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Your Premier Skill-Sharing & Learning Platform
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            Discover new skills, share your expertise, and connect with like-minded learners in diverse fields.
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button variant="contained" color="primary" size="large" component={RouterLink} to="/skills" startIcon={<ExploreIcon />}>
              Explore Skills
            </Button>
            <Button variant="outlined" color="primary" size="large" component={RouterLink} to="/categories" startIcon={<CategoryIcon />}>
              Browse Categories
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Trending Skills Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2">
            Trending Skills
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {trendingSkills.map((skill) => (
            <Grid item xs={12} sm={6} md={4} key={skill.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
                component={RouterLink}
                to={`/skills/${skill.id}`}
                style={{ textDecoration: 'none' }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%',
                    bgcolor: 'primary.light',
                  }}
                  image="/api/placeholder/400/225"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {skill.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {skill.description && skill.description.length > 100 
                      ? `${skill.description.substring(0, 100)}...` 
                      : skill.description}
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      size="small" 
                      label={skill.difficultyLevel} 
                      color={
                        skill.difficultyLevel === 'BEGINNER' ? 'success' :
                        skill.difficultyLevel === 'INTERMEDIATE' ? 'info' :
                        skill.difficultyLevel === 'ADVANCED' ? 'warning' : 'error'
                      }
                    />
                    <Chip 
                      size="small" 
                      label={skill.categoryName} 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {trendingSkills.length === 0 && !loading && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  No trending skills available at the moment.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/skills?trending=true"
          >
            View All Trending Skills
          </Button>
        </Box>
      </Box>

      {/* Popular Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CategoryIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2">
            Explore Categories
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {popularCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
                component={RouterLink}
                to={`/categories/${category.id}`}
                style={{ textDecoration: 'none' }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    pt: '56.25%',
                    bgcolor: 'secondary.light',
                  }}
                  image={category.iconUrl || "/api/placeholder/400/225"}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description && category.description.length > 100 
                      ? `${category.description.substring(0, 100)}...` 
                      : category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {popularCategories.length === 0 && !loading && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1">
                  No categories available at the moment.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/categories"
          >
            View All Categories
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;