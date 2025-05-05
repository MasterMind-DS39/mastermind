import React, { Component } from 'react';
import "./MainPage.css";
import Post from '../Post/Post';
import uploadImage from "../../images/upload.png";
import CreatePostModal from '../CreatePostModal/CreatePostModal';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            postArray: [],
            showModal: false
        };
    }

    componentDidMount() {
        this.getPost();
    }

    getPost = () => {
        const thisContext = this;
        fetch('http://localhost:8080/post')
            .then(response => response.json())
            .then(data => {
                thisContext.setState({ postArray: data });
            });
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    handleModalClose = (shouldRefresh) => {
        this.setState({ showModal: false });
        if (shouldRefresh) {
            this.getPost();
        }
    }

    render() {
        return (
            <div>
                <div className="mainpage__container">
                    <div className="mainpage__divider"></div>
                    <div className="fileupload">
                        <div 
                            className="create-post-button"
                            onClick={this.toggleModal}
                        >
                            <img 
                                className="mainpage__uploadicon" 
                                src={uploadImage} 
                                alt="Upload" 
                            />
                            <span>Create Post</span>
                        </div>
                    </div>
                    <div className="mainpage__divider"></div>
                </div>
                
                {this.state.postArray.map((item) => (
                    <Post 
                        key={item.postId}
                        id={item.postId}
                        userName={item.userName}
                        postImages={item.imagePaths}
                        postVideos={item.videoPaths}
                        likes={item.likeCount}
                        caption={item.caption}
                        hashtags={item.hashtags}
                    />
                ))}

                {this.state.showModal && 
                    <CreatePostModal 
                        onClose={this.handleModalClose} 
                        userData={JSON.parse(localStorage.getItem("users"))}
                    />
                }
            </div>
        );
    }
}

export default MainPage;