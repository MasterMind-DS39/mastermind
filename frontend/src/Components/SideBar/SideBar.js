import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Avatar,
  Divider,
  Typography
} from '@mui/material';
import {
  Group as GroupIcon,
  VideoLibrary as VideoLibraryIcon,
  Bookmark as BookmarkIcon,
  History as MemoryIcon,
  Storefront as StorefrontIcon,
  Home as HomeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 280,
  height: 'calc(100vh - 48px)',
  background: 'linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)',
  position: 'fixed',
  top: 50,
  left: 0,
  zIndex: 120,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '4px 0 30px rgba(0, 0, 0, 0.2)',
  },
}));

const ProfileSection = styled(Box)({
  padding: '24px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
});

const StyledAvatar = styled(Avatar)({
  width: 48,
  height: 48,
  border: '2px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});

const StyledListItem = styled(ListItem)({
  borderRadius: '12px',
  margin: '0 12px 4px',
  padding: '10px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateX(4px)',
  },
  '&.active': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontWeight: '600',
  },
});

const Sidebar = () => {
  const navigate = useNavigate();

  const handleItemClick = (link) => {
    if (link) {
      navigate(link);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("users");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const menuItems = [
    { icon: <HomeIcon />, text: 'Home', link: "/" },
    { icon: <MemoryIcon />, text: 'Learning Plans', link: "/learning-plans" },
    { icon: <BookmarkIcon />, text: 'Saved', link: "/saved" },
    { icon: <GroupIcon />, text: 'Conversations', link: "/conversations" },
    { icon: <VideoLibraryIcon />, text: 'Categories', link: "/categories" },
    { icon: <StorefrontIcon />, text: 'About', link: "/about" },
  ];

  return (
    <StyledSidebar>
      <ProfileSection>
        <StyledAvatar 
          src="/path/to/profile.jpg" 
          alt="Randunu Dissanayake"
        />
        <Box>
          <Typography variant="subtitle1" color="white" fontWeight="500">
            Randunu Dissanayake
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
            Premium Member
          </Typography>
        </Box>
      </ProfileSection>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
      
      <List sx={{ flex: 1 }}>
        {menuItems.map((item, index) => (
          <StyledListItem 
            button 
            key={index}
            onClick={() => handleItemClick(item.link)}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                color: 'white',
                fontSize: '0.95rem',
              }} 
            />
          </StyledListItem>
        ))}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mt: 'auto' }} />
      
      <List>
        <StyledListItem 
          button 
          onClick={handleLogout}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              color: 'white',
              fontSize: '0.95rem',
            }} 
          />
        </StyledListItem>
      </List>
    </StyledSidebar>
  );
};

export default Sidebar;