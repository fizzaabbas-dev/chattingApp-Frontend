import { useEffect, useState } from "react";
import ChatRoom from "./components/ChatRoom";
import "./App.css";
import { io } from "socket.io-client";

// Define the Socket URL without leading spaces
const SOCKET_URL = "http://backend-chattingapp-production.up.railway.app";

let socket;

function App() {
  const [joined, setJoined] = useState(false);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  // Initialize socket connection on component mount
  useEffect(() => {
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to Railway server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle leaving the chat room
  const handleLeave = () => {
    if (socket && room) {
      socket.emit("leave", room);
    }

    setUsername("");
    setRoom("");
    setJoined(false);
  };

  // Handle joining a chat room and sending user details
  const handleSubmit = (e) => {
    e.preventDefault();

    if (socket && room && username) {
      // Emit join event with both room and username to match backend expectations
      socket.emit("join", { room, username });
    }

    setJoined(true);
  };

  return (
    <>
      {joined === false ? (
        <div className="join-group-container">
          <h2 style={{ color: "black" }}>Join a Chat Group</h2>

          <form className="join-group-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Group Name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              required
            />

            <button type="submit">Join</button>
          </form>
        </div>
      ) : (
        <ChatRoom
          username={username}
          room={room}
          socket={socket}
          onLeave={handleLeave}
        />
      )}
    </>
  );
}

export default App;