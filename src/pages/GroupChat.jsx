import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { db, DB_CHAT_KEY } from "../../firebaseConfig";
import { ref, onValue, set, off } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdModeEdit, MdDelete } from "react-icons/md";
import { GiNewShoot } from "react-icons/gi";
import "./GroupChat.css";
import Background from "../assets/images/bg.jpg";
import { IoMdSend } from "react-icons/io";
import { RxUpdate } from "react-icons/rx"


export default function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("userfb");
    if (!userLocalStorage) {
      navigate("/");
    } else {
      const userLocalStorageObject = JSON.parse(userLocalStorage);
      setUser(userLocalStorageObject);

      const chatRef = ref(db, DB_CHAT_KEY);
      const onChatChange = (snapshot) => {
        const newMessages = snapshot.val();
        if (!Array.isArray(newMessages)) {
          setMessages([]);
        } else {
          setMessages(newMessages);
        }
      };
      onValue(chatRef, onChatChange);

      return () => {
        off(chatRef, onChatChange);
      };
    }
  }, [navigate]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        id: uuidv4(),
        content: newMessage,
        sender: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        timestamp: new Date().toISOString(),
      };

      const newMessages = [...messages, message];
      const chatRef = ref(db, DB_CHAT_KEY);
      set(chatRef, newMessages);
      setNewMessage("");
      setSelectedMessage(null);
    }
  };

  const deleteMessage = (messageId) => {
    const updatedMessages = messages.filter((message) => message.id !== messageId);
    const chatRef = ref(db, DB_CHAT_KEY);
    set(chatRef, updatedMessages);
  };

  const updateMessage = () => {
    if (selectedMessage && newMessage.trim() !== "") {
      if (selectedMessage.sender.uid === user.uid) {
        const updatedMessages = messages.map((message) =>
          message.id === selectedMessage.id
            ? {
                ...message,
                content: newMessage,
                timestamp: new Date().toISOString(),
              }
            : message
        );
        const chatRef = ref(db, DB_CHAT_KEY);
        set(chatRef, updatedMessages);
      }
      setNewMessage("");
      setSelectedMessage(null);
    }
  };
  const formatTimestamp = (timestamp) => {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  return (
   
      <div className="chat-container"   style={{
        backgroundImage: `url(${Background})`,
      }}>
        <div className="chat-header">
          <h1 style={{
            textShadow: "2px 2px 3px rgba(0, 0, 0.0, 0.4)"
            }}>
            Group Atma Youth <GiNewShoot className="gi-new-shoot" />
          </h1>
        </div>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message-container ${
                message.sender.uid === user.uid ? "sent" : "received"
              }`}
            >
              <div className="message-info">
                <div className="message-user">
                  {message.sender.photoURL && (
                    <img
                      src={message.sender.photoURL}
                      alt={`${message.sender.displayName}`}
                      className="message-avatar"
                    />
                  )}
                  <span className="message-sender">
                    <strong>{message.sender.displayName}</strong>
                  </span>
                </div>
                {message.sender.uid === user.uid && (
                  <div className="message-actions">
                    <span
                      className="message-action"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <MdModeEdit />
                    </span>
                    <span
                      className="message-action"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <MdDelete />
                    </span>
                  </div>
                )}
              </div>
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <textarea
            rows="3"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          {selectedMessage ? (
            <button
              onClick={updateMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <RxUpdate style={{ fontSize: "20px" }} />
            </button>
          ) : (
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
             <IoMdSend style={{ fontSize: "20px" }} />
            </button>
          )}
        </div>
      </div>
  );
}