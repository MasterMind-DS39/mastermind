// Sidebar.js
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MemoryIcon from '@mui/icons-material/History';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = () => (
  <Box
    sx={{
      width: 240,
      height: '100vh',
      bgcolor: '#000000', // Pure black background
      borderRight: '1px solid #333',
      position: 'fixed',
      top: 56, // height of your navbar
      left: 0,
      zIndex: 120,
      pt: 2,
      color: 'white', // Default text color for the sidebar,
    }}
  >
    <List>
      <ListItem>
        <ListItemIcon>
          <Avatar src="/path/to/profile.jpg" />
        </ListItemIcon>
        <ListItemText 
          primary="Sachintha Rajapaksha" 
          primaryTypographyProps={{ color: 'white' }} 
        />
      </ListItem>
      {[
        { icon: <HomeIcon />, text: 'Home' },
        { icon: <MemoryIcon />, text: 'Memories' },
        { icon: <BookmarkIcon />, text: 'Saved' },
        { icon: <GroupIcon />, text: 'Groups' },
        { icon: <VideoLibraryIcon />, text: 'Video' },
        { icon: <StorefrontIcon />, text: 'Marketplace' },
      ].map((item, index) => (
        <ListItem 
          button 
          key={index}
          sx={{
            '&:hover': {
              backgroundColor: '#333', // Dark gray hover
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
          <ListItemText 
            primary={item.text} 
            primaryTypographyProps={{ color: 'white' }} 
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

export default Sidebar;