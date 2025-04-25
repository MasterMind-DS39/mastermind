import React, { Component } from 'react';
import "./NavBar.css";
import Grid from '@mui/material/Grid';
import insta_log from "../../images/logo3.jpg";
import home from "../../images/home.svg";
import message from "../../images/message.svg";
import find from "../../images/find.svg";
import react from "../../images/love.svg";
import Avatar from '@mui/material/Avatar';
import pp from "../../images/pp1.png";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleLogout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem("users");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };

    render() { 
        return ( 
            <div className="navbar__container">
                <div className="navbar__content">
                    <Grid container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={3}>
                            <Link to="/">
                                <img className="navbar_logo" src={insta_log} width="105px" height="30px" alt="Instagram" />
                            </Link>
                        </Grid>
                        <Grid item xs={3}>
                            <input type="text" className="navbar__searchBar" placeholder="Search" />
                        </Grid>
                        <Grid item xs={3} style={{"display":"flex"}}>
                            <Link to="/profile">
                                <img className="navbar__img" src={home} width="25px" height="25" alt="Home"/>
                            </Link>
                            <img className="navbar__img" src={message} width="25px" height="25" alt="Messages" />
                            <img className="navbar__img" src={find} width="25px" height="25" alt="Explore" />
                            <img className="navbar__img" src={react} width="25px" height="25" alt="Activity" />
                            <Link to="/profile">
                                <Avatar src={pp} className="navbar__img" style={{"maxWidth":"25px","maxHeight":"25px"}} alt="Profile" />
                            </Link>
                            <button 
                                onClick={this.handleLogout}
                                className="navbar__logout"
                            >
                                Logout
                            </button>
                        </Grid>
                        <Grid item xs={1}></Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
 
export default NavBar;
