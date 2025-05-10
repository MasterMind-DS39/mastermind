// src/Components/SavedPosts/SavedPosts.js
import React, { useEffect, useState } from 'react';
import Post from '../Post/Post';
import NavBar from '../NavBar/NavBar';

const SavedPosts = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("users"));

  useEffect(() => {
    if (!user?.userId && !user?.uid) return;
    const userId = user.userId || user.uid;
    fetch(`http://localhost:8080/saved/${userId}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <NavBar />
      <div style={{ marginLeft: '400px', marginTop: '100px' }}>
        <h2>Saved Posts</h2>
        {posts.length === 0 ? (
          <div>No saved posts yet.</div>
        ) : (
          <div className="posts-container">
            {posts.map(item => (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;