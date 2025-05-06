// MainContent.js
import React, { Component } from 'react';
import "./MainContent.css";
import Grid from '@mui/material/Grid';
import StatusBar from '../StatusBar/StatusBar';
import MainPage from '../MainPage/MainPage';
import InfoSection from '../InfoSection/InfoSection';
import Suggestions from '../Suggestions/Suggestions';
import Sidebar from '../SideBar/SideBar'; // Import the new Sidebar

class MainContent extends Component {
    render() { 
        return ( 
            <div>
                <div className="sidebar-container">
                    <Sidebar />
                </div>
                <Grid container>
                    <Grid item xs={2} /> {/* Empty for spacing, can be removed */}
                    <Grid item xs={8} style={{ marginLeft: 240, marginTop: 56 }}> {/* Shifted right */}
                        <div>
                            <StatusBar />
                            <MainPage />
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                        <InfoSection />
                        <Suggestions />
                    </Grid>
                </Grid>
            </div>
         );
    }
}
 
export default MainContent;
