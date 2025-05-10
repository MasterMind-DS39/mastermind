import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { Avatar, Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import avatarPlaceholder from "../../images/avatar-placeholder.png";
import "./ChatArea.css";

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("users"));
  return user && user.uid ? user.uid : null;
}

export default function ChatArea({ otherUser }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!otherUser) return;
    async function fetchOrCreateChat() {
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUserId)
      );
      const snapshot = await getDocs(q);
      let found = null;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (
          data.participants.includes(currentUserId) &&
          data.participants.includes(otherUser.userId)
        ) {
          found = { id: docSnap.id, ...data };
        }
      });
      if (found) {
        setChatId(found.id);
      } else {
        const docRef = await addDoc(chatsRef, {
          participants: [currentUserId, otherUser.userId],
        });
        setChatId(docRef.id);
      }
    }
    fetchOrCreateChat();
  }, [otherUser, currentUserId]);

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      setTimeout(() => {
        if (messagesEndRef.current)
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
    return () => unsubscribe();
  }, [chatId]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId: currentUserId,
      text: input,
      createdAt: serverTimestamp(),
    });
    setInput("");
  }

  if (!otherUser) return null;

  return (
    <Box className="chat-area-container">
      {/* Header */}
      <Box className="chat-area-header chat-area-sticky-header">
        <Avatar src={avatarPlaceholder} />
        <Typography variant="h6" className="chat-area-username">
          {otherUser.userName}
        </Typography>
      </Box>

      {/* Messages */}
      <Box className="chat-area-messages chat-area-scrollable">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <Box
              key={msg.id}
              className={`chat-area-message-row ${isMe ? "me" : "them"}`}
            >
              <Box className="chat-area-message-bubble">
                {msg.text}
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Bar */}
      <Box component="form" onSubmit={handleSend} className="chat-area-inputbar">
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          sx={{
            bgcolor: "white",
            input: { color: "#212529" },
            borderRadius: 2,
            mr: 1,
            "& fieldset": { borderColor: "#e9ecef" },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!input.trim()}
          sx={{
            bgcolor: "#2196f3",
            color: "white",
            "&:hover": { bgcolor: "#1976d2" },
            borderRadius: 2,
            padding: "8px",
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}