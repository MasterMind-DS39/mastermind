// src/Components/CreatePostModal/CreatePostModal.js
import React, { useState, useRef } from 'react';
import './CreatePostModal.css';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';

function CreatePostModal({ onClose }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostSubmit = () => {
        if (!selectedFile) return;
        
        setIsUploading(true);
        const storageRef = ref(storage, `images/${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload failed:", error);
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at:", downloadURL);

                    let payload = {
                        postId: Math.floor(Math.random() * 100000).toString(),
                        userId: JSON.parse(localStorage.getItem("users")).uid,
                        postPath: downloadURL,
                        timeStamp: new Date().getTime(),
                        likeCount: 0,
                        caption: caption,
                        hashtags: hashtags
                    };

                    const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    };

                    fetch("http://localhost:8080/post", requestOptions)
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("Post created:", data);
                            setIsUploading(false);
                            onClose(true); // Close modal and refresh posts
                        })
                        .catch((error) => {
                            console.error("Post creation failed:", error);
                            setIsUploading(false);
                        });
                });
            }
        );
    };

    // Get current user data
    const userData = JSON.parse(localStorage.getItem("users"));
    const userName = userData ? userData.displayName || "User" : "User";

    return (
        <div className="modal-overlay">
            <div className="create-post-modal">
                <div className="modal-header">
                    <h2>Create Post</h2>
                    <button className="close-button" onClick={() => onClose(false)}>
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="modal-user-info">
                    <Avatar src="" />
                    <span>{userName}</span>
                </div>
                
                <div className="modal-content">
                    {!previewUrl ? (
                        <div 
                            className="file-upload-area"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="upload-prompt">
                                <ImageIcon style={{ fontSize: 60, color: '#65676b' }} />
                                <p>Add photos/videos</p>
                                <p className="drag-text">or drag and drop</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />
                                <button 
                                    className="select-button"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Select from computer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="post-preview-container">
                            <img src={previewUrl} alt="Preview" className="image-preview" />
                            <div className="caption-input-container">
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="caption-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Add hashtags (e.g. #nature #photography)"
                                    value={hashtags}
                                    onChange={(e) => setHashtags(e.target.value)}
                                    className="hashtag-input"
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="modal-footer">
                    {isUploading ? (
                        <div className="upload-progress">
                            <CircularProgress variant="determinate" value={uploadProgress} size={24} />
                            <span>{uploadProgress}%</span>
                        </div>
                    ) : (
                        <button 
                            className="post-button" 
                            onClick={handlePostSubmit}
                            disabled={!selectedFile}
                        >
                            Post
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreatePostModal;
