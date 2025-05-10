// src/pages/skills/SkillEdit.js
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

import SkillService from '../../services/SkillService';
import SkillCategoryService from '../../services/SkillCategoryService';
import SkillAnalyticsService from '../../services/SkillAnalyticsService';
import SkillForm from '../../components/skills/SkillForm';

function SkillEdit() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const data = await SkillService.getSkillById(id);
        setSkill(data);
      } catch (err) {
        console.error('Error fetching skill:', err);
        setError('Failed to load skill data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSkill();
    }
  }, [id]);

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
        {!loading && skill && (
          <Link component={RouterLink} to={`/skills/${id}`} color="inherit">
            {skill.name}
          </Link>
        )}
        <Typography color="text.primary">Edit</Typography>
      </Breadcrumbs>
      
      {/* Page Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Edit Skill {skill?.name && `- ${skill.name}`}
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
      ) : skill ? (
        /* Skill Form */
        <SkillForm initialData={skill} isEditing={true} />
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          Skill not found.
        </Alert>
      )}
    </Container>
  );
}

export default SkillEdit;