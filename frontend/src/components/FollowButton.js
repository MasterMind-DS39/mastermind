import React, { useState } from "react";
import api from "../api/axios";

export default function FollowButton({ followerId, followedId }) {
  const [following, setFollowing] = useState(false);

  const follow = () => {
    api.post("/follows", { followerId, followedId })
      .then(() => setFollowing(true))
      .catch(err => alert(err.response?.data?.message || err.message));
  };

  return (
    <button disabled={following} onClick={follow}>
      {following ? "Following" : "Follow"}
    </button>
  );
}
