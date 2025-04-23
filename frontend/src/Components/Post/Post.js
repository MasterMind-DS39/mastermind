// D:\skillProto\frontend\frontend\src\Components\Post\Post.js
import React, { Component } from 'react';
import "./Post.css";
import Avatar from '@mui/material/Avatar';
import comment from "../../images/comment.svg"; 
import share from "../../images/share.svg"; 
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            commentList: [],
            likeCount: this.props.likes || 0,
            liked: false
        };
    }

    componentDidMount() {
        this.getComments();
        this.getLikeStatus();
    }

    getComments = () => {
        fetch('http://localhost:8080/comments/' + this.props.id)
            .then(response => response.json())
            .then(data => {
                this.setState({commentList: data});
            });
    }
    
    getLikeStatus = () => {
        const userId = JSON.parse(localStorage.getItem("users")).uid;
        fetch(`http://localhost:8080/likes/${this.props.id}/${userId}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    liked: data.liked,
                    likeCount: data.likeCount
                });
            })
            .catch(error => {
                console.error("Error fetching like status:", error);
            });
    }
    
    // Update the handleLikeClick method in D:\skillProto\frontend\frontend\src\Components\Post\Post.js
    handleLikeClick = () => {
    const userId = JSON.parse(localStorage.getItem("users")).uid;
    fetch(`http://localhost:8080/likes/${this.props.id}/${userId}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            this.setState({
                liked: data.liked,
                likeCount: data.likeCount
            });
            console.log("Like status updated:", data.liked, "Like count:", data.likeCount);
        })
        .catch(error => {
            console.error("Error toggling like:", error);
        });
}

    
    submitComments = (event) => {
        if(event.key === "Enter") {
            let comment = event.currentTarget.value;
            if(comment !== null && comment !== undefined && comment.trim() !== '') {
                let payload = {
                    "commentId": Math.floor(Math.random() * 1000000).toString(),
                    "userId": JSON.parse(localStorage.getItem("users")).uid,
                    "postId": this.props.id,
                    "timeStamp": new Date().getTime(),
                    "comment": comment
                };
    
                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                };
    
                fetch("http://localhost:8080/comments", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        this.getComments();
                        event.currentTarget.value = '';
                    })
                    .catch(error => {
                        console.error("Error posting comment:", error);
                    });
            }
        }
    }

    renderHashtags = (hashtags) => {
        if (!hashtags) return null;
        
        return (
            <div className="post_hashtags">
                {hashtags.split(' ').map((tag, index) => (
                    <span key={index} className="hashtag">{tag}</span>
                ))}
            </div>
        );
    }

    render() { 
        return ( 
            <div className="post__container">
                {/* Header */}
                <div className="post__header">
                    <Avatar className="post__image" src="" />
                    <div className="post__username">{this.props.userName}</div>
                </div>

                {/* Image */}
                <div>
                    <img src={this.props.postImage} width="615px" alt="Post" /> 
                </div>

                {/* Analytics */}
                <div>
                    <div style={{"marginLeft":"10px"}}>
                        <div className="post_likeButton" onClick={this.handleLikeClick}>
                            {this.state.liked ? 
                                <FavoriteIcon style={{ color: "red", cursor: "pointer" }} className="post_reactimage" /> : 
                                <FavoriteBorderIcon style={{ cursor: "pointer" }} className="post_reactimage" />
                            }
                        </div>
                        <img src={comment} className="post_reactimage" alt="Comment"/>
                        <img src={share} className="post_reactimage" alt="Share"/>
                    </div>
                    <div style={{"fontWeight":"bold","marginLeft":"20px"}}>
                        {this.state.likeCount} likes     
                    </div>
                </div>

                {/* Caption and Hashtags */}
                {this.props.caption && (
                    <div className="post_caption">
                        <span className="username">{this.props.userName}</span> {this.props.caption}
                    </div>
                )}
                
                {this.renderHashtags(this.props.hashtags)}

                {/* Comment Section */}
                <div>
                    {this.state.commentList.map((item, index) => (
                        index < 4 ?
                            <div className="post_comment" key={item.commentId}>
                                <span className="comment_username">{item.userName}</span> {item.comment}
                            </div> 
                            : null
                    ))}
                    <input 
                        type="text" 
                        onKeyPress={this.submitComments} 
                        className="post__commentbox" 
                        placeholder="Add a comment..." 
                    />
                </div>
            </div> 
        );
    }
}
 
export default Post;
