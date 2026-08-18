import { useEffect, useState } from "react";

const ChatRoom = ({ username, room, socket, onLeave }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // Track active users inside the room, starting with the current user
  const [activeUsers, setActiveUsers] = useState(new Set([username]));

  // Listen for incoming messages and extract active users automatically
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
      {/* WhatsApp Style Header */}
      <div className="chatroom-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>{room}</h2>
          <small style={{ color: "#ddd", fontSize: "12px" }}>
            🟢 {activeUsers.size} online
          </small>
        </div>
        <button className="leave-btn" onClick={onLeave}>
          Leave
        </button>
      </div>

      {/* Active Users Bar (WhatsApp Group Info style) */}
      <div style={{ padding: "8px 15px", background: "#f8f9fa", borderBottom: "1px solid #eee", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontWeight: "600", color: "#555" }}>Online:</span>
        {Array.from(activeUsers).map((user, idx) => (
          <span key={idx} style={{ background: "#e2e8f0", padding: "2px 8px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", backgroundColor: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
            {user}
          </span>
        ))}
      </div>

      {/* Chat Messages Box */}
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

      {/* Input Form */}
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