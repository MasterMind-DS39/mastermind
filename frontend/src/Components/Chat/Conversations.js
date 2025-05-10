import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { Avatar, Typography, Badge, IconButton } from "@mui/material"; // Added IconButton
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Added back icon
import HomeIcon from "@mui/icons-material/Home"; // Added home icon
import ChatArea from "./ChatArea";
import avatarPlaceholder from "../../images/avatar-placeholder.png";
import "./Conversations.css";

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("users"));
  return user && user.uid ? user.uid : null;
}

export default function Conversations() {
  const navigate = useNavigate(); // Initialize navigate
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!currentUserId) return;
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUserId)
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherId = data.participants.find((id) => id !== currentUserId);
        let userData = null;
        if (otherId) {
          const res = await fetch(`http://localhost:8080/users/${otherId}`);
          userData = await res.json();
        }
        chatList.push({
          id: docSnap.id,
          otherUser: userData,
        });
      }
      setChats(chatList);
    });
    return () => unsubscribe();
  }, [currentUserId]);

  function openChat(chat) {
    setSelectedChat(chat.id);
    setOtherUser(chat.otherUser);
  }

  return (
    <div className="chat-root">
      {/* Left sidebar */}
      <div className="chat-sidebar">
        <div className="chat-header">
          <IconButton 
            onClick={() => navigate("/")} 
            sx={{ color: "white", mr: 1 }}
          >
            <ArrowBackIcon /> {/* or <HomeIcon /> */}
          </IconButton>
          <Typography variant="h5" className="chat-sidebar-title">
            Chats
          </Typography>
        </div>
        <input
          className="chat-search"
          placeholder="Search users"
          type="text"
          disabled
        />
        <div className="chat-list">
          {chats.length === 0 && (
            <Typography sx={{ color: "#bbb", textAlign: "center", mt: 3 }}>
              No conversations yet.
            </Typography>
          )}
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={
                "chat-list-item" +
                (selectedChat === chat.id ? " chat-list-item-selected" : "")
              }
              onClick={() => openChat(chat)}
            >
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  src={chat.otherUser?.photoURL || avatarPlaceholder}
                  sx={{ width: 48, height: 48 }}
                />
              </Badge>
              <div className="chat-list-item-texts">
                <span className="chat-list-item-username">
                  {chat.otherUser?.userName || "Unknown"}
                </span>
                <span className="chat-list-item-lastmsg">
                  {chat.otherUser?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right pane */}
      <div className="chat-main">
        {!otherUser ? (
          <div className="chat-main-placeholder">
            <Typography variant="h4" sx={{ color: "#bbb", mb: 2 }}>
              Click on a conversation to start chatting.
            </Typography>
          </div>
        ) : (
          <ChatArea otherUser={otherUser} />
        )}
      </div>
    </div>
  );
}