// src/pages/skills/SkillsBrowse.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Chip,
  IconButton,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SortIcon from '@mui/icons-material/Sort';

import SkillService from '../../services/SkillService';
import SkillCategoryService from '../../services/SkillCategoryService';
import SkillAnalyticsService from '../../services/SkillAnalyticsService';

function SkillsBrowse() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // State
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters and Search
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(queryParams.get('category') || '');
  const [difficultyFilter, setDifficultyFilter] = useState(queryParams.get('difficulty') || '');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'name');
  const [sortDirection, setSortDirection] = useState(queryParams.get('direction') || 'asc');
  const [isTrending, setIsTrending] = useState(queryParams.get('trending') === 'true');
  const [page, setPage] = useState(parseInt(queryParams.get('page') || '0', 10));
  
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  
  useEffect(() => {
    // Fetch categories for filter dropdown
    const fetchCategories = async () => {
      try {
        const result = await SkillCategoryService.getAllCategories();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    // Fetch skills based on current filters
    const fetchSkills = async () => {
      try {
        setLoading(true);
        let response;
        
        if (searchTerm) {
          // Search takes priority
          response = await SkillService.searchSkills(searchTerm, page, 9);
        } else if (isTrending) {
          // Then trending filter
          response = await SkillService.getTrendingSkills(page, 9);
        } else if (categoryFilter) {
          // Then category filter
          response = await SkillService.getSkillsByCategory(categoryFilter, page, 9);
        } else if (difficultyFilter) {
          // Then difficulty filter
          response = await SkillService.getSkillsByDifficulty(difficultyFilter, page, 9);
        } else {
          // Otherwise get all skills with sorting
          response = await SkillService.getAllSkills(page, 9, sortBy, sortDirection);
        }
        
        setSkills(response.content || []);
        setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, [searchTerm, categoryFilter, difficultyFilter, sortBy, sortDirection, page, isTrending]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (categoryFilter) params.set('category', categoryFilter);
    if (difficultyFilter) params.set('difficulty', difficultyFilter);
    if (sortBy !== 'name') params.set('sortBy', sortBy);
    if (sortDirection !== 'asc') params.set('direction', sortDirection);
    if (isTrending) params.set('trending', 'true');
    if (page > 0) params.set('page', page.toString());
    
    navigate({ search: params.toString() });
  }, [searchTerm, categoryFilter, difficultyFilter, sortBy, sortDirection, page, isTrending, navigate]);
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page on new search
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    setPage(0); // Reset to first page on filter change
    
    const { name, value } = e.target;
    switch (name) {
      case 'category':
        setCategoryFilter(value);
        break;
      case 'difficulty':
        setDifficultyFilter(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
      case 'direction':
        setSortDirection(value);
        break;
      default:
        break;
    }
  };
  
  // Handle pagination change
  const handlePageChange = (event, value) => {
    setPage(value - 1); // API uses 0-based page index
    window.scrollTo(0, 0); // Scroll to top on page change
  };
  
  // Toggle trending filter
  const handleTrendingToggle = () => {
    setIsTrending(!isTrending);
    setPage(0); // Reset to first page
    
    // Clear other filters when toggling trending
    if (!isTrending) {
      setCategoryFilter('');
      setDifficultyFilter('');
      setSearchTerm('');
    }
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setDifficultyFilter('');
    setSortBy('name');
    setSortDirection('asc');
    setIsTrending(false);
    setPage(0);
  };
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Browse Skills
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/skills/create"
          >
            Add New Skill
          </Button>
        </Box>
        <Divider />
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Skills"
                name="search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" edge="end">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                variant={isTrending ? "contained" : "outlined"}
                color="primary"
                startIcon={<TrendingUpIcon />}
                onClick={handleTrendingToggle}
                fullWidth
              >
                {isTrending ? "Trending Skills" : "Show Trending"}
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                variant="outlined" 
                onClick={handleClearFilters}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} /> Filter Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={categoryFilter}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={difficultyFilter}
                  onChange={handleFilterChange}
                  label="Difficulty"
                >
                  <MenuItem value="">
                    <em>All Levels</em>
                  </MenuItem>
                  {difficulties.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={sortBy}
                  onChange={handleFilterChange}
                  label="Sort By"
                  startAdornment={<SortIcon sx={{ mr: 1 }} />}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="popularityScore">Popularity</MenuItem>
                  <MenuItem value="difficultyLevel">Difficulty</MenuItem>
                  <MenuItem value="createdAt">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Direction</InputLabel>
                <Select
                  name="direction"
                  value={sortDirection}
                  onChange={handleFilterChange}
                  label="Direction"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Results */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Filter summary */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {skills.length === 0 ? (
                  'No skills found matching your criteria'
                ) : (
                  `Showing ${skills.length} skill${skills.length !== 1 ? 's' : ''}`
                )}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {searchTerm && (
                  <Chip 
                    label={`Search: "${searchTerm}"`} 
                    onDelete={() => setSearchTerm('')}
                  />
                )}
                {categoryFilter && (
                  <Chip 
                    label={`Category: ${categories.find(c => c.id.toString() === categoryFilter.toString())?.name || categoryFilter}`} 
                    onDelete={() => setCategoryFilter('')}
                  />
                )}
                {difficultyFilter && (
                  <Chip 
                    label={`Difficulty: ${difficultyFilter}`} 
                    onDelete={() => setDifficultyFilter('')}
                  />
                )}
                {isTrending && (
                  <Chip 
                    icon={<TrendingUpIcon />}
                    label="Trending Only" 
                    onDelete={handleTrendingToggle}
                  />
                )}
              </Box>
            </Box>
          
            {/* Skill cards */}
            <Grid container spacing={3}>
              {skills.map((skill) => (
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
                        position: 'relative',
                      }}
                      image="/api/placeholder/400/225"
                    >
                      {skill.isTrending && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'error.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                          }}
                        >
                          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Trending
                        </Box>
                      )}
                    </CardMedia>
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
                        {skill.tags && skill.tags.length > 0 && (
                          <Chip 
                            size="small"
                            label={`${skill.tags.length} tag${skill.tags.length !== 1 ? 's' : ''}`}
                            variant="outlined"
                            color="secondary"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              {skills.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                      No skills found matching your criteria.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleClearFilters}
                      sx={{ mt: 2 }}
                    >
                      Clear Filters
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page + 1} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default SkillsBrowse;