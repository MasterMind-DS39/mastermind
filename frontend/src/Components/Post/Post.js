import React, { Component } from 'react';
import "./Post.css";
import Avatar from '@mui/material/Avatar';
import comment from "../../images/comment.svg";
import share from "../../images/share.svg";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FitScreenIcon from '@mui/icons-material/FitScreen';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentList: [],
      likeCount: this.props.likes || 0,
      liked: false,
      showGallery: false,
      currentMediaIndex: 0,
      mutedVideos: {},
      manuallyPausedVideos: {},
      videoProgress: {},
      videoHovered: {},
      showMenu: false,
      saved: false,
      saving: false,
    };

    this.postRef = React.createRef();
    this.menuRef = React.createRef();
    this.videoRefs = [];
    this.videoObserver = null;
  }

  componentDidMount() {
    this.getComments();
    this.getLikeStatus();
    this.setupVideoObserver();
    this.fetchSavedStatus();
    document.addEventListener("mousedown", this.handleClickOutsideMenu);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postVideos !== this.props.postVideos || 
        prevProps.postImages !== this.props.postImages) {
      this.setupVideoObserver();
    }
  }

  componentWillUnmount() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
    document.removeEventListener("mousedown", this.handleClickOutsideMenu);
  }

  handleClickOutsideMenu = (event) => {
    if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
      this.setState({ showMenu: false });
    }
  };

  fetchSavedStatus = () => {
    const user = JSON.parse(localStorage.getItem("users"));
    const userId = user?.userId || user?.uid;
    if (!userId) return;
    fetch(`http://localhost:8080/saved/${userId}/${this.props.id}`)
      .then(res => res.json())
      .then(data => this.setState({ saved: !!data }))
      .catch(() => this.setState({ saved: false }));
  };

  handleSaveToggle = () => {
    const user = JSON.parse(localStorage.getItem("users"));
    const userId = user?.userId || user?.uid;
    if (!userId) return;
    this.setState({ saving: true });

    if (!this.state.saved) {
      fetch(`http://localhost:8080/saved/${userId}/${this.props.id}`, { method: "POST" })
        .then(res => res.json())
        .then(() => this.setState({ saved: true, saving: false, showMenu: false }))
        .catch(() => this.setState({ saving: false }));
    } else {
      fetch(`http://localhost:8080/saved/${userId}/${this.props.id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => this.setState({ saved: false, saving: false, showMenu: false }))
        .catch(() => this.setState({ saving: false }));
    }
  };

  setupVideoObserver = () => {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }

    this.videoObserver = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = entry.target;
          const index = parseInt(video.dataset.index, 10);

          if (this.state.manuallyPausedVideos[index]) return;

          if (entry.isIntersecting) {
            video.muted = true;
            this.setState(prev => ({
              mutedVideos: {
                ...prev.mutedVideos,
                [index]: true
              }
            }));
            video.play().catch(e => {});
          } else {
            if (!this.state.manuallyPausedVideos[index]) {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.7,
        rootMargin: "0px 0px 100px 0px"
      }
    );

    setTimeout(() => {
      const videos = this.postRef.current?.querySelectorAll('video') || [];
      videos.forEach((video, index) => {
        video.dataset.index = index;
        this.videoObserver.observe(video);
        this.videoRefs[index] = video;
        this.setState(prev => ({
          mutedVideos: {
            ...prev.mutedVideos,
            [index]: true
          },
          manuallyPausedVideos: {
            ...prev.manuallyPausedVideos,
            [index]: false
          }
        }));
      });
    }, 100);
  }

  getComments = () => {
    fetch('http://localhost:8080/comments/' + this.props.id)
      .then(response => response.json())
      .then(data => {
        this.setState({ commentList: data });
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  }

  getLikeStatus = () => {
    const userId = JSON.parse(localStorage.getItem("users"))?.uid;
    if (!userId) return;

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

  handleLikeClick = () => {
    const userId = JSON.parse(localStorage.getItem("users"))?.uid;
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    this.setState(prevState => ({ 
      liked: !prevState.liked, 
      likeCount: prevState.liked ? prevState.likeCount - 1 : prevState.likeCount + 1 
    }));

    fetch(`http://localhost:8080/likes/${this.props.id}/${userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        this.setState({ 
          liked: data.liked, 
          likeCount: data.likeCount 
        });
      })
      .catch(error => {
        console.error("Error toggling like:", error);
        this.getLikeStatus();
      });
  }

  submitComments = (event) => {
    if (event.key === "Enter") {
      const commentText = event.currentTarget.value.trim();
      if (!commentText) return;

      const userId = JSON.parse(localStorage.getItem("users"))?.uid;
      if (!userId) return;

      const payload = {
        commentId: Math.floor(Math.random() * 1000000).toString(),
        userId,
        postId: this.props.id,
        timeStamp: new Date().getTime(),
        comment: commentText
      };

      fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to post comment");
          return response.json();
        })
        .then(() => {
          this.getComments();
          event.currentTarget.value = '';
        })
        .catch(error => {
          console.error("Error posting comment:", error);
        });
    }
  }

  toggleVideoMute = (index, e) => {
    e.stopPropagation();
    const video = this.videoRefs[index];
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;

    this.setState(prev => ({
      mutedVideos: {
        ...prev.mutedVideos,
        [index]: newMutedState
      }
    }));
  }

  toggleVideoPlay = (index, e) => {
    e.stopPropagation();
    const video = this.videoRefs[index];
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => {
          this.setState(prev => ({
            manuallyPausedVideos: {
              ...prev.manuallyPausedVideos,
              [index]: false
            }
          }));
        })
        .catch(error => {
          console.error("Error playing video:", error);
        });
    } else {
      video.pause();
      this.setState(prev => ({
        manuallyPausedVideos: {
          ...prev.manuallyPausedVideos,
          [index]: true
        }
      }));
    }
  }

  openGallery = (index) => {
    this.setState({
      showGallery: true,
      currentMediaIndex: index
    });
  }

  closeGallery = () => {
    this.setState({ showGallery: false });
  }

  navigateGallery = (direction) => {
    this.setState(prev => {
      const allMedia = this.getAllMedia();
      const newIndex = (prev.currentMediaIndex + direction + allMedia.length) % allMedia.length;
      return { currentMediaIndex: newIndex };
    });
  }

  handleVideoTimeUpdate = (index) => {
    const video = this.videoRefs[index];
    if (!video) return;

    this.setState(prev => ({
      videoProgress: {
        ...prev.videoProgress,
        [index]: {
          currentTime: video.currentTime,
          duration: video.duration
        }
      }
    }));
  };

  handleVideoSeek = (index, e) => {
    e.stopPropagation();
    const video = this.videoRefs[index];
    if (!video) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekPercentage = clickPosition / progressBarWidth;
    video.currentTime = seekPercentage * video.duration;
  };

  handleVideoHover = (index, isHovered) => {
    this.setState(prev => ({
      videoHovered: {
        ...prev.videoHovered,
        [index]: isHovered
      }
    }));
  };

  getAllMedia = () => {
    const { postImages = [], postVideos = [] } = this.props;
    return [
      ...postImages.map(path => ({ type: 'image', path })),
      ...postVideos.map(path => ({ type: 'video', path }))
    ];
  }

  renderMediaGrid = () => {
    const allMedia = this.getAllMedia();
    if (allMedia.length === 0) return null;

    const gridClass = `post__media-grid post__media-grid-${Math.min(allMedia.length, 4)}`;

    return (
      <div className="post__media-container">
        <div className={gridClass}>
          {allMedia.slice(0, 4).map((media, index) => (
            <div 
              key={index} 
              className="post__media-item-container" 
              onClick={() => this.openGallery(index)}
            >
              {media.type === 'image' ? (
                <img 
                  src={media.path} 
                  alt={`Post ${index}`} 
                  className="post__media-item" 
                  loading="lazy"
                />
              ) : (
                <div 
                  className="post__video-item"
                  onMouseEnter={() => this.handleVideoHover(index, true)}
                  onMouseLeave={() => this.handleVideoHover(index, false)}
                >
                  <video
                    ref={el => this.videoRefs[index] = el}
                    src={media.path}
                    className="post__media-item"
                    loop
                    playsInline
                    muted={this.state.mutedVideos[index]}
                    data-index={index}
                    onClick={(e) => this.toggleVideoPlay(index, e)}
                    onTimeUpdate={() => this.handleVideoTimeUpdate(index)}
                  />
                  <div 
                    className="post__video-play-button"
                    onClick={(e) => this.toggleVideoPlay(index, e)}
                  >
                    {this.videoRefs[index]?.paused ? (
                      <PlayCircleOutlineIcon className="play-pause-icon" />
                    ) : (
                      <PauseCircleOutlineIcon className="play-pause-icon" />
                    )}
                  </div>
                  <div 
                    className="post__video-mute-button"
                    onClick={(e) => this.toggleVideoMute(index, e)}
                  >
                    {this.state.mutedVideos[index] ? (
                      <VolumeOffIcon className="volume-icon" />
                    ) : (
                      <VolumeUpIcon className="volume-icon" />
                    )}
                  </div>
                  {(this.state.videoHovered[index] || this.videoRefs[index]?.paused) && (
                    <div 
                      className="post__video-progress-container" 
                      onClick={(e) => this.handleVideoSeek(index, e)}
                    >
                      <div className="post__video-progress-bar">
                        <div 
                          className="post__video-progress"
                          style={{
                            width: `${(this.state.videoProgress[index]?.currentTime / this.state.videoProgress[index]?.duration) * 100 || 0}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="post__video-duration">
                    <FitScreenIcon style={{ fontSize: '20px' }} />
                  </div>
                </div>
              )}
              {index === 3 && allMedia.length > 4 && (
                <div className="post__media-more-overlay">
                  +{allMedia.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderGalleryModal = () => {
    const allMedia = this.getAllMedia();
    const currentMedia = allMedia[this.state.currentMediaIndex];
    if (!currentMedia) return null;

    return (
      <div className="media-gallery-modal" onClick={this.closeGallery}>
        <div className="gallery-close" onClick={this.closeGallery}>
          <CloseIcon />
        </div>
        
        <div className="gallery-content" onClick={e => e.stopPropagation()}>
          {currentMedia.type === 'image' ? (
            <img 
              src={currentMedia.path} 
              alt="Gallery view" 
              className="gallery-media" 
            />
          ) : (
            <div className="gallery-video-container">
              <video
                src={currentMedia.path}
                className="gallery-media"
                controls
                autoPlay
                loop
              />
            </div>
          )}
        </div>
        
        {allMedia.length > 1 && (
          <div className="gallery-controls">
            <div 
              className="gallery-control" 
              onClick={(e) => {
                e.stopPropagation();
                this.navigateGallery(-1);
              }}
            >
              <ArrowBackIcon />
            </div>
            <div 
              className="gallery-control" 
              onClick={(e) => {
                e.stopPropagation();
                this.navigateGallery(1);
              }}
            >
              <ArrowForwardIcon />
            </div>
          </div>
        )}
      </div>
    );
  }

  renderHashtags = () => {
    const { hashtags } = this.props;
    if (!hashtags) return null;

    const hashtagArray = hashtags.split(' ').filter(tag => tag.trim() !== '');
    
    return (
      <div className="post_hashtags">
        {hashtagArray.map((tag, index) => (
          <span key={index} className="hashtag">
            {tag}
          </span>
        ))}
      </div>
    );
  }

  renderKebabMenu = () => {
    return (
      <div className="post__menu-wrapper" ref={this.menuRef} style={{ position: "relative" }}>
        <div
          className="post__menu-icon"
          style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", zIndex: 2 }}
          onClick={() => this.setState({ showMenu: !this.state.showMenu })}
        >
          <MoreVertIcon />
        </div>
        {this.state.showMenu && (
          <div
            className="post__menu-dropdown"
            style={{
              position: "absolute",
              top: 28,
              right: 0,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: 6,
              minWidth: 140,
              zIndex: 10,
              padding: "8px 0"
            }}
          >
            <div
              className="post__menu-item"
              style={{
                padding: "8px 16px",
                cursor: this.state.saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                color: "#333"
              }}
              onClick={this.handleSaveToggle}
            >
              {this.state.saved ? (
                <>
                  <BookmarkIcon style={{ marginRight: 8, color: "#4f46e5" }} />
                  Unsave Post
                </>
              ) : (
                <>
                  <BookmarkBorderIcon style={{ marginRight: 8 }} />
                  Save Post
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="post__container" ref={this.postRef} style={{ position: "relative" }}>
        {/* Header with kebab menu */}
        <div className="post__header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar className="post__image" src={this.props.profileImage} />
            <div className="post__username">{this.props.userName}</div>
          </div>
          {this.renderKebabMenu()}
        </div>
        
        {this.renderMediaGrid()}
        
        <div className="post-actions">
          <div className="action-buttons">
            <div className="post_likeButton" onClick={this.handleLikeClick}>
              {this.state.liked ? (
                <FavoriteIcon style={{ color: "#ed4956" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </div>
            <img src={comment} className="post_reactimage" alt="comment" />
            <img src={share} className="post_reactimage" alt="share" />
          </div>
          
          <div className="like-count">
            {this.state.likeCount} likes
          </div>
        </div>
        
        <div className="post_caption">
          <span className="username" style={{ color: 'black' }}>
            {this.props.userName}
          </span> {this.props.caption}
        </div>

        {this.renderHashtags()}
        
        <div className="comments-section">
          {this.state.commentList.slice(0, 3).map((item, index) => (
            <div className="post_comment" key={index}>
              <span className="comment_username">{item.userName}</span> {item.comment}
            </div>
          ))}
        </div>
        
        <input
          className="post__commentbox"
          placeholder="Add a comment..."
          onKeyPress={this.submitComments}
        />
        
        {this.state.showGallery && this.renderGalleryModal()}
      </div>
    );
  }
}

export default Post;
