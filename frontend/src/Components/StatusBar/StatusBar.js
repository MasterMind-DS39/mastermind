import React, { Component } from 'react';
import "./StatusBar.css";
import Avatar from '@mui/material/Avatar';
import statusimg from "../../images/pp1.png";
import uploadimage from "../../images/statusadd.png";
import { storage, auth } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            statusList: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        fetch('http://localhost:8080/status')
            .then(response => response.json())
            .then(data => {
                this.setState({ statusList: data });
            });
    }   

    uploadStatus = (event) => {
        const image = event.target.files[0];
        const thisContext = this;
        
        if (!image) return;

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
                        };

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
            <div>
                <div className="statusbar__container">
                    <div className="fileupload">
                        <label htmlFor="file-upload-status">
                            <img 
                                className="statusbar__upload" 
                                src={uploadimage} 
                                width="55px" 
                                height="55px" 
                                alt="Upload status" 
                            />
                        </label>
                        <input 
                            id="file-upload-status" 
                            onChange={this.uploadStatus} 
                            type="file"
                            accept="image/*"
                        />
                    </div>
                    {this.state.statusList.map((item) => (
                        <div className="status" key={item.statusId}>
                            <Avatar className="statusbar__status" src={item.path} />
                            <div className="statusbar__text">{item.userName}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
 
export default StatusBar;