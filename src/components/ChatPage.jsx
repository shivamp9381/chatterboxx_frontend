// import React, { useEffect, useRef, useState } from "react";
// import { MdAttachFile, MdSend } from "react-icons/md";
// import useChatContext from "../context/ChatContext";
// import { useNavigate } from "react-router";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import toast from "react-hot-toast";
// import { baseURL } from "../config/AxiosHelper";
// import { getMessagess } from "../services/RoomService";
// import { timeAgo } from "../config/helper";

// const ChatPage = () => {
//   const {
//     roomId,
//     currentUser,
//     connected,
//     setConnected,
//     setRoomId,
//     setCurrentUser,
//   } = useChatContext();

//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatBoxRef = useRef(null);
//   const [stompClient, setStompClient] = useState(null);

//   // Redirect if not connected
//   useEffect(() => {
//     if (!connected) {
//       navigate("/");
//     }
//   }, [connected]);

//   // Load existing messages
//   useEffect(() => {
//     async function loadMessages() {
//       try {
//         const msgs = await getMessagess(roomId);
//         setMessages(msgs);
//       } catch (error) {
//         console.error("Failed to load messages:", error);
//       }
//     }

//     if (connected && roomId) {
//       loadMessages();
//     }
//   }, [connected, roomId]);

//   // Auto-scroll
//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // WebSocket connection
//   useEffect(() => {
//     if (!connected || !roomId) return;

//     const sock = new SockJS(`${baseURL}/chat`);
//     const client = Stomp.over(sock);

//     client.debug = () => {};

//     client.connect(
//       {},
//       () => {
//         setStompClient(client);
//         toast.success("Connected to room!");

//         client.subscribe(`/topic/room/${roomId}`, (message) => {
//           const newMessage = JSON.parse(message.body);
//           setMessages((prev) => [...prev, newMessage]);
//         });
//       },
//       (error) => {
//         console.error("WebSocket error:", error);
//         toast.error("Connection failed. Please rejoin.");
//       }
//     );

//     return () => {
//       if (client && client.connected) {
//         client.disconnect();
//       }
//     };
//   }, [roomId, connected]);

//   // Send message
//   const sendMessage = () => {
//     if (!stompClient || !stompClient.connected || !input.trim()) return;

//     const message = {
//       sender: currentUser,
//       content: input.trim(),
//       roomId: roomId,
//     };

//     stompClient.send(
//       `/app/sendMessage/${roomId}`,
//       {},
//       JSON.stringify(message)
//     );

//     setInput("");
//   };

//   // Leave room
//   const handleLogout = () => {
//     if (stompClient && stompClient.connected) {
//       stompClient.disconnect();
//     }
//     setConnected(false);
//     setRoomId("");
//     setCurrentUser("");
//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-3xl mx-auto w-full bg-slate-800 text-white">

//       {/* Header */}
//       <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-3 bg-gray-900 shadow-md">
//         <h1 className="text-sm sm:text-lg">
//           Room: <span className="text-blue-400">{roomId}</span>
//         </h1>

//         <h1 className="text-sm sm:text-lg">
//           User: <span className="text-green-400">{currentUser}</span>
//         </h1>

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full text-xs sm:text-sm w-fit"
//         >
//           Leave Room
//         </button>
//       </header>

//       {/* Messages */}
//       <div
//         ref={chatBoxRef}
//         className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-slate-700"
//       >
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.sender === currentUser
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-lg max-w-[75%] sm:max-w-md break-words shadow ${
//                 message.sender === currentUser
//                   ? "bg-green-600"
//                   : "bg-gray-700"
//               }`}
//             >
//               <p className="text-xs font-bold mb-1 opacity-80">
//                 {message.sender}
//               </p>
//               <p className="text-sm">{message.content}</p>
//               <p className="text-xs text-gray-300 mt-1">
//                 {timeAgo(message.timestamp)}
//               </p>
//             </div>
//           </div>
//         ))}

//         {messages.length === 0 && (
//           <div className="text-center text-gray-400 mt-20">
//             No messages yet. Say hello! 👋
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gray-800 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
//         />

//         <button
//           title="Attach file"
//           className="shrink-0 bg-purple-600 hover:bg-purple-700 p-2 rounded-full"
//         >
//           <MdAttachFile size={18} />
//         </button>

//         <button
//           onClick={sendMessage}
//           title="Send message"
//           className="shrink-0 bg-green-600 hover:bg-green-700 p-2 rounded-full"
//         >
//           <MdSend size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);

  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  useEffect(() => {
    if (connected && roomId) {
      getMessagess(roomId).then(setMessages);
    }
  }, [connected, roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.reconnectDelay = 5000;
    client.heartbeatIncoming = 4000;
    client.heartbeatOutgoing = 4000;

    client.connect({}, () => {
      setStompClient(client);

      // 🔥 messages
      client.subscribe(`/topic/room/${roomId}`, (msg) => {
        setMessages((prev) => [...prev, JSON.parse(msg.body)]);
      });

      // 🔥 typing
      client.subscribe(`/topic/typing/${roomId}`, (msg) => {
        const user = msg.body;
        if (user !== currentUser) {
          setTypingUser(user);
          setTimeout(() => setTypingUser(""), 2000);
        }
      });

      // 🔥 users
      client.subscribe(`/topic/users/${roomId}`, (msg) => {
        setUsers(JSON.parse(msg.body));
      });

      // 🔥 notify join
      client.send(`/app/join/${roomId}`, {}, currentUser);
    });

    return () => client.disconnect();
  }, [roomId, connected]);

  const sendMessage = () => {
    if (!stompClient || !input.trim()) return;

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify({
      sender: currentUser,
      content: input,
      roomId,
    }));

    setInput("");
  };

  const handleTyping = () => {
    stompClient?.send(`/app/typing/${roomId}`, {}, currentUser);
  };

  const handleLogout = () => {
    stompClient?.disconnect();
    logout();
    setConnected(false);
    navigate("/login");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${baseURL}/api/v1/files/upload`, {
      method: "POST",
      body: formData,
    });

    const url = await res.text();

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify({
      sender: currentUser,
      content: url,
      roomId,
    }));
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full bg-slate-800 text-white">

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-900">
        <div className="text-sm">
          Room: <span className="text-blue-400">{roomId}</span>
        </div>

        <div className="text-xs text-gray-400">
          Online: {users.join(", ")}
        </div>

        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded text-xs">
          Logout
        </button>
      </header>

      {/* MESSAGES */}
      <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}>
            <div className="bg-gray-700 p-2 rounded max-w-[75%]">
              <p className="text-xs">{msg.sender}</p>

              {msg.content.startsWith("http") ? (
                <a href={msg.content} target="_blank" className="text-blue-300 underline">
                  View File
                </a>
              ) : (
                <p>{msg.content}</p>
              )}

              <p className="text-xs text-gray-400">{timeAgo(msg.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TYPING */}
      {typingUser && (
        <p className="text-xs text-gray-400 px-3">{typingUser} is typing...</p>
      )}

      {/* INPUT */}
      <div className="flex gap-2 p-3 bg-gray-900">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          className="flex-1 min-w-0 px-3 py-2 rounded-full bg-gray-700"
        />

        <input type="file" hidden id="fileInput" onChange={handleFileUpload} />

        <button onClick={() => document.getElementById("fileInput").click()}>
          <MdAttachFile />
        </button>

        <button onClick={sendMessage}>
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;