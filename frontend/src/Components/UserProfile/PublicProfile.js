// src/Components/UserProfile/PublicProfile.js
import React, { Component } from 'react';
import "./Profile.css";
import Post from "../Post/Post";
import { Avatar } from '@mui/material';
import coverPlaceholder from "../../images/cover-placeholder.jpg";
import avatarPlaceholder from "../../images/avatar-placeholder.png";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams, useNavigate } from 'react-router-dom';

function withRouter(Component) {
  return props => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}

class PublicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchUserData();
    this.fetchUserPosts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.userId !== this.props.params.userId) {
      this.fetchUserData();
      this.fetchUserPosts();
    }
  }

  fetchUserData = () => {
    const { userId } = this.props.params;
    if (userId) {
      fetch(`http://localhost:8080/users/${userId}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ userData: data });
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }

  fetchUserPosts = () => {
    const { userId } = this.props.params;
    if (userId) {
      fetch(`http://localhost:8080/post/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ posts: data, loading: false });
        })
        .catch(error => {
          console.error("Error fetching user posts:", error);
          this.setState({ loading: false });
        });
    }
  }

  render() {
    const { userData, posts, loading } = this.state;

    return (
      <div className="profile__page-container">
        {/* Back button positioned at top left */}
        <div className="profile__back-button-container">
          <Link to="/" className="profile__back-button">
            <ArrowBackIcon />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="profile__container">
          <div className="profile__header">
            <div className="profile__cover">
              <img src={coverPlaceholder} alt="Cover" className="cover-image" />
            </div>
            <div className="profile__info">
              <Avatar 
                src={userData?.profileImage || avatarPlaceholder}
                className="profile__avatar"
              />
              <div className="profile__details">
                <h2 className="profile__username">{userData?.userName || "User"}</h2>
                <p className="profile__name">{userData?.name || ""}</p>
              </div>
            </div>
          </div>
          <hr className="profile__separator" />
          <div className="profile__content">
            <div className="profile__posts">
              <h3 className="profile__section-title">Posts</h3>
              {loading ? (
                <div className="profile__loading">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="profile__no-posts">No posts yet</div>
              ) : (
                posts.map((post) => (
                  <div key={post.postId} className="profile__post-container">
                    <div className="post__header-with-options">
                      {post.pinned && (
                        <div className="post__pinned-indicator">
                          <span className="pinned-icon">📌</span>
                          <span>Pinned Post</span>
                        </div>
                      )}
                      <Post
                        id={post.postId}
                        userName={post.userName}
                        postImages={post.imagePaths || []}
                        postVideos={post.videoPaths || []}
                        caption={post.caption}
                        hashtags={post.hashtags}
                        likes={post.likeCount}
                        profileImage={userData?.profileImage || avatarPlaceholder}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PublicProfile);
