import React, { useState, useEffect } from "react";
import api from "../api/axios";
import CommentList from "./CommentList";

export default function PostList({ userId }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get("/posts").then(res => setPosts(res.data));
  }, []);

  function handleCreate() {
    if (!content.trim()) return;
    api.post("/posts", { userId, content }).then(res => {
      setPosts(posts => [res.data, ...posts]);
      setContent("");
    });
  }

  return (
    <div>
      <h3>All Posts</h3>
      <input style={{ width: "65%" }} placeholder="What's on your mind?" value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleCreate}>Post</button>
      <ul style={{ paddingLeft: 0 }}>
        {posts.map(post =>
          <li key={post.id} style={{ border: "1px solid #ccc", margin: 10, borderRadius: 8, padding: 10 }}>
            <strong>User {post.user ? post.user.username : post.userId}</strong>: {post.content}
            <br />
            <PostActions postId={post.id} userId={userId} />
            <CommentList postId={post.id} userId={userId} />
          </li>
        )}
      </ul>
    </div>
  );
}

function PostActions({ postId, userId }) {
  function react(type) {
    api.post("/reactions", { postId, userId, type }).catch(err => alert(err.response?.data?.message || err.message));
  }

  return (
    <span>
      <button onClick={() => react("LIKE")}>👍 Like</button>
      <button onClick={() => react("HEART")}>❤️ Heart</button>
    </span>
  );
}
