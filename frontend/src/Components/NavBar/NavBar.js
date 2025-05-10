import React, { Component } from 'react';
import "./NavBar.css";
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import insta_log from "../../images/logo3.jpg";
import home from "../../images/home.svg";
import message from "../../images/message.svg";
import find from "../../images/find.svg";
import react from "../../images/love.svg";
import Avatar from '@mui/material/Avatar';
import pp from "../../images/pp1.png";
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import NotificationPanel from '../Notification/NotificationPanel';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            searchResults: [],
            showSuggestions: false,
            activeIcon: 'home',
            showNotifications: false,
            notifications: [],
            unreadCount: 0
        };
        this.notificationRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.checkForUnreadNotifications();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    checkForUnreadNotifications = () => {
        const userId = JSON.parse(localStorage.getItem("users"))?.uid;
        if (!userId) return;

        fetch(`http://localhost:8080/notifications/unread/${userId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ unreadCount: data.count || 0 });
            })
            .catch(err => {
                console.error("Error fetching unread notifications:", err);
            });
    }

    handleClickOutside = (event) => {
        if (this.notificationRef.current && !this.notificationRef.current.contains(event.target) && 
            !event.target.closest('.notification-icon')) {
            this.setState({ showNotifications: false });
        }
    }

    handleSearchChange = (e) => {
        const query = e.target.value;
        this.setState({ 
            searchQuery: query, 
            showSuggestions: query.length > 0 
        });

        if (query.length > 0) {
            fetch(`http://localhost:8080/users/search?username=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    this.setState({ searchResults: data });
                })
                .catch(error => {
                    console.error("Error searching users:", error);
                });
        } else {
            this.setState({ searchResults: [] });
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const query = this.state.searchQuery.trim();
            if (query) {
                window.location.href = `/?search=${encodeURIComponent(query)}`;
            }
        }
    };

    setActiveIcon = (iconName) => {
        this.setState({ activeIcon: iconName });
    };

    toggleNotifications = () => {
        if (!this.state.showNotifications) {
            this.openNotifications();
        } else {
            this.closeNotifications();
        }
    }

    openNotifications = () => {
        const userId = JSON.parse(localStorage.getItem("users"))?.uid;
        if (!userId) return;
    
        fetch(`http://localhost:8080/notifications/${userId}`)
            .then(res => res.json())
            .then(data => {
                const notifications = Array.isArray(data) ? data : [];
                this.setState({ 
                    notifications, 
                    showNotifications: true,
                    unreadCount: 0
                });
                fetch(`http://localhost:8080/notifications/markAllRead/${userId}`, { method: "POST" });
            })            
            .catch(err => {
                console.error("Error fetching notifications:", err);
                this.setState({ notifications: [], showNotifications: true });
            });
    }
    
    closeNotifications = () => {
        this.setState({ showNotifications: false });
    }

    renderSuggestions = () => {
        if (!this.state.showSuggestions) return null;
    
        return (
            <div className="search-suggestions">
                {this.state.searchResults.length === 0 ? (
                    <div className="no-results-message">
                        <div>No users found for "{this.state.searchQuery}"</div>
                    </div>
                ) : (
                    this.state.searchResults.map(user => (
                        <Link 
                            key={user.userId}
                            to={`/profile/${user.userId}`}
                            className="suggestion-item"
                            onClick={() => this.setState({ showSuggestions: false })}
                        >
                            <Avatar src={user.profileImage} className="suggestion-avatar" />
                            <div className="suggestion-details">
                            <div className="suggestion-username">{user.userName}</div>
                            <div className="suggestion-name">{user.name}</div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        );
    };

    render() { 
        return ( 
            <div className="navbar">
                <div className="navbar-container">
                    <div className="navbar-left">
                        <Link to="/" className="logo-link">
                            <img className="logo" src={insta_log} alt="App Logo" />
                        </Link>
                    </div>
                    
                    <div className="navbar-center">
                        <div className="search-container">
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search users or hashtags..." 
                                value={this.state.searchQuery}
                                onChange={this.handleSearchChange}
                                onKeyPress={this.handleKeyPress}
                            />
                            {this.renderSuggestions()}
                        </div>
                    </div>
                    
                    <div className="navbar-right">
                        <Link 
                            to="/" 
                            className={`nav-icon ${this.state.activeIcon === 'home' ? 'active' : ''}`}
                            onClick={() => this.setActiveIcon('home')}
                        >
                            <img src={home} alt="Home" />
                        </Link>
                        <Link 
                            to="/messages" 
                            className={`nav-icon ${this.state.activeIcon === 'message' ? 'active' : ''}`}
                            onClick={() => this.setActiveIcon('message')}
                        >
                            <img src={message} alt="Messages" />
                        </Link>
                        <Link 
                            to="/explore" 
                            className={`nav-icon ${this.state.activeIcon === 'explore' ? 'active' : ''}`}
                            onClick={() => this.setActiveIcon('explore')}
                        >
                            <img src={find} alt="Explore" />
                        </Link>
                        
                        <div 
                            className={`nav-icon notification-icon ${this.state.activeIcon === 'notifications' ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                this.setActiveIcon('notifications');
                                this.toggleNotifications();
                            }}
                        >
                            <Badge badgeContent={this.state.unreadCount} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </div>

                        <Link 
                            to="/activity" 
                            className={`nav-icon ${this.state.activeIcon === 'activity' ? 'active' : ''}`}
                            onClick={() => this.setActiveIcon('activity')}
                        >
                            <img src={react} alt="Activity" />
                        </Link>
                        <Link 
                            to="/profile" 
                            className={`nav-icon ${this.state.activeIcon === 'profile' ? 'active' : ''}`}
                            onClick={() => this.setActiveIcon('profile')}
                        >
                            <Avatar src={pp} className="profile-avatar" />
                        </Link>
                    </div>
                </div>

                {this.state.showNotifications && (
                    <div ref={this.notificationRef}>
                        <NotificationPanel 
                            notifications={this.state.notifications}
                            onClose={this.closeNotifications}
                        />
                    </div>
                )}
            </div>
        );
    }
}
 
export default NavBar;