import React, { Component } from 'react';
import "./StatusBar.css";
import Avatar from '@mui/material/Avatar';
import statusimg from "../../images/pp1.png";
import uploadimage from "../../images/statusadd.png";
import { storage, auth } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusList: [],
            showLeftNav: false,
            showRightNav: true
        }
        this.statusBarRef = React.createRef();
    }

    componentDidMount() {
        this.getData();
        this.checkNavigation();
        window.addEventListener('resize', this.checkNavigation);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkNavigation);
    }

    checkNavigation = () => {
        if (this.statusBarRef.current) {
            const container = this.statusBarRef.current;
            this.setState({
                showLeftNav: container.scrollLeft > 0,
                showRightNav: container.scrollLeft < (container.scrollWidth - container.clientWidth)
            });
        }
    }

    handleScroll = () => {
        this.checkNavigation();
    }

    scrollLeft = () => {
        if (this.statusBarRef.current) {
            this.statusBarRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    }

    scrollRight = () => {
        if (this.statusBarRef.current) {
            this.statusBarRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    }

    getData = () => {
        fetch('http://localhost:8080/status')
            .then(response => response.json())
            .then(data => {
                this.setState({ statusList: data });
                setTimeout(this.checkNavigation, 100);
            });
    }

    uploadStatus = (event) => {
        const image = event.target.files[0];
        const thisContext = this;
        if (!image) return;
        
<<<<<<< HEAD
        // Create a reference to 'status/[imageName]'
        const storageRef = ref(storage, `status/${image.name}`);
        
        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // You can add progress tracking here if needed
            },
            (error) => {
                console.error("Upload failed:", error);
            },
            () => {
                // Upload completed, get download URL
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        console.log("Status available at:", downloadURL);
                        let payload = {
                            statusId: Math.floor(Math.random() * 100000).toString(),
                            userId: JSON.parse(localStorage.getItem("users")).uid,
                            path: downloadURL,
                            timeStamp: new Date().getTime()
                        }
                        
                        const requestOptions = {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                        };
                        
                        fetch("http://localhost:8080/status", requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                thisContext.getData();
                            })
                            .catch(error => {
                                console.error("Status creation failed:", error);
                            });
                    })
                    .catch(error => {
                        console.error("Error getting download URL:", error);
                    });
            }
        );
    }

    render() {
        return (
            <div className="statusbar__container-wrapper">
                {this.state.showLeftNav && (
                    <button className="nav-button nav-button-left" onClick={this.scrollLeft}>
                        <ArrowBackIosNewIcon />
                    </button>
=======
        <div 
          className="statusbar__container" 
          ref={this.statusBarRef}
          onScroll={this.handleScroll}
        >
          <div className="status create-story">
            <div className="create-story-button" onClick={this.openUploadModal}>
              <div className="create-story-icon">
                <AddIcon />
              </div>
              <span className="create-story-text">Share Daily Skills</span>
            </div>
          </div>
          
          {this.state.statusList.map((status, index) => (
            <div 
              className="status" 
              key={status.statusId}
              onClick={() => this.openStoryViewer(index)}
            >
              <div className="status-card">
                {status.mediaType === 'video' ? (
                  <div className="status-video-container">
                    <video 
                      src={status.path} 
                      className="status-background" 
                      muted
                    />
                    <div className="video-indicator"></div>
                  </div>
                ) : (
                  <img 
                    src={status.path} 
                    className="status-background" 
                    alt="status"
                  />
>>>>>>> c2f91e5268317fddd1592149e7e295de905c8223
                )}
                
                <div 
                    className="statusbar__container" 
                    ref={this.statusBarRef}
                    onScroll={this.handleScroll}
                >
                    <div className="status create-story">
                        <label htmlFor="status-upload" className="create-story-button">
                            <div className="create-story-icon">
                                <AddIcon />
                            </div>
                            <span className="create-story-text">Create story</span>
                            <input 
                                id="status-upload" 
                                type="file" 
                                onChange={this.uploadStatus} 
                                accept="image/*"
                            />
                        </label>
                    </div>
                    
                    {this.state.statusList.map((status, index) => (
                        <div className="status" key={status.statusId}>
                            <div className="status-card">
                                <img 
                                    src={status.path} 
                                    className="status-background" 
                                    alt="status"
                                />
                                <div className="status-overlay"></div>
                                <div className="status-user-info">
                                    <Avatar 
                                        className="statusbar__status" 
                                        src={statusimg} 
                                    />
                                    <div className="statusbar__text">{status.userName || `User ${index + 1}`}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {this.state.showRightNav && (
                    <button className="nav-button nav-button-right" onClick={this.scrollRight}>
                        <ArrowForwardIosIcon />
                    </button>
                )}
            </div>
        );
    }
}

export default StatusBar;
