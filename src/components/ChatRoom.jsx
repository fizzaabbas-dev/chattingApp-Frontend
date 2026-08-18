import { useEffect, useState } from "react";

const ChatRoom = ({ username, room, socket, onLeave }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState(new Set([username]));

  // Listen for incoming messages and track active participants
  useEffect(() => {
    if (!socket) return;

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.username) {
        setActiveUsers((prev) => new Set(prev).add(msg.username));
      }
    });

    return () => {
      socket.off("message");
    };
  }, [socket, username]);

  // Handle sending a new message
  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("send", { text: message, room: room, username: username });
      setMessage("");
    }
  };

  return (
    <div className="chatroom-container">
      <div className="chatroom-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Room: {room}</h2>
          {/* WhatsApp style online count and active users list */}
          <small style={{ color: "gray", fontSize: "12px" }}>
            🟢 {activeUsers.size} online: {Array.from(activeUsers).join(", ")}
          </small>
        </div>
        <button className="leave-btn" onClick={onLeave}>
          Leave
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message${msg.username === username ? " own" : ""}`}
          >
            <span className="chat-username">{msg.username}:</span>{" "}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;