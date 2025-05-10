import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../firebase";
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
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import avatarPlaceholder from "../../images/avatar-placeholder.png";

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("users"));
  return user && user.uid ? user.uid : null;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ChatModal({ open, onClose, otherUser }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!open || !otherUser) return;
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
  }, [open, otherUser, currentUserId]);

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
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "#18191A",
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#23272F",
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          pb: 1,
          pt: 2,
        }}
      >
        <Avatar src={avatarPlaceholder} sx={{ width: 40, height: 40, mr: 2 }} />
        <Typography variant="h6" flex={1}>
          {otherUser.userName}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          bgcolor: "#18191A",
          px: 0,
          pt: 1,
          pb: 0,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 1,
            bgcolor: "#18191A",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <List sx={{ p: 0 }}>
            {messages.map((msg, i) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <ListItem
                  key={msg.id}
                  sx={{
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    display: "flex",
                    p: 0,
                    mb: 1,
                  }}
                  disableGutters
                >
                  {!isMe && (
                    <Avatar
                      src={avatarPlaceholder}
                      sx={{
                        width: 28,
                        height: 28,
                        mr: 1,
                        alignSelf: "flex-end",
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      bgcolor: isMe ? "#1976d2" : "#242526",
                      color: "white",
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      borderBottomRightRadius: isMe ? 4 : 16,
                      borderBottomLeftRadius: isMe ? 16 : 4,
                      maxWidth: "70%",
                      wordBreak: "break-word",
                      boxShadow: 2,
                      fontSize: 16,
                    }}
                  >
                    {msg.text}
                  </Box>
                  {isMe && (
                    <Avatar
                      src={avatarPlaceholder}
                      sx={{
                        width: 28,
                        height: 28,
                        ml: 1,
                        alignSelf: "flex-end",
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            bgcolor: "#23272F",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            fullWidth
            size="small"
            sx={{
              bgcolor: "#20232A",
              input: { color: "white" },
              mr: 1,
              borderRadius: 2,
              "& fieldset": { border: "none" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!input.trim()}
                    sx={{
                      bgcolor: "#1976d2",
                      color: "white",
                      "&:hover": { bgcolor: "#1565c0" },
                      borderRadius: 2,
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
