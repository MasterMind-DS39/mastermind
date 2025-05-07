import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function CommentList({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    api.get(`/comments/post/${postId}`).then(res => setComments(res.data));
  }, [postId]);

  function handleComment() {
    if (!content.trim()) return;
    api.post("/comments", { postId, userId, content })
      .then(res => {
        setComments(c => [res.data, ...c]);
        setContent("");
      });
  }

  return (
    <div>
      <div style={{ marginTop: 5 }}>
        <input
          style={{ width: "60%" }}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleComment}>Comment</button>
      </div>
      <ul style={{ paddingLeft: 0 }}>
        {comments.map(comment =>
          <li key={comment.id} style={{ fontSize: 14, margin: "2px 0" }}>
            <strong>{comment.user ? comment.user.username : comment.userId}</strong>: {comment.content}
          </li>
        )}
      </ul>
    </div>
  );
}
