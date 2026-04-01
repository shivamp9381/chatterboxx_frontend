// import React, { useEffect, useRef, useState } from "react";
// import { MdSend } from "react-icons/md";
// import useChatContext from "../context/ChatContext";
// import useAuthContext from "../context/AuthContext";
// import { useNavigate } from "react-router";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import { baseURL } from "../config/AxiosHelper";

// const ChatPage = () => {
//   const { roomId, currentUser, connected } = useChatContext();
//   const { logout } = useAuthContext();
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [typingUser, setTypingUser] = useState("");
//   const [users, setUsers] = useState([]);

//   const stompRef = useRef(null);

//   useEffect(() => {
//     if (!connected) navigate("/");
//   }, [connected]);

//   useEffect(() => {
//     const sock = new SockJS(`${baseURL}/chat`);
//     const client = Stomp.over(sock);

//     client.connect({}, () => {
//       stompRef.current = client;

//       // messages
//       client.subscribe(`/topic/room/${roomId}`, (msg) => {
//         setMessages((prev) => [...prev, JSON.parse(msg.body)]);
//       });

//       // typing
//       client.subscribe(`/topic/typing/${roomId}`, (msg) => {
//         const user = msg.body;
//         if (user !== currentUser) {
//           setTypingUser(user);
//           setTimeout(() => setTypingUser(""), 2000);
//         }
//       });

//       // users
//       client.subscribe(`/topic/users/${roomId}`, (msg) => {
//         setUsers(JSON.parse(msg.body));
//       });

//       // seen
//       client.subscribe(`/topic/seen/${roomId}`, (msg) => {
//         const id = msg.body;
//         setMessages((prev) =>
//           prev.map((m) =>
//             m.id === id ? { ...m, seen: true } : m
//           )
//         );
//       });

//       // private
//       client.subscribe(`/topic/private`, (msg) => {
//         const message = JSON.parse(msg.body);
//         if (message.roomId.includes(currentUser)) {
//           setMessages((prev) => [...prev, message]);
//         }
//       });

//       client.send(`/app/join/${roomId}`, {}, currentUser);
//     });

//     return () => client.disconnect();
//   }, []);

//   const sendMessage = () => {
//     stompRef.current.send(
//       `/app/sendMessage/${roomId}`,
//       {},
//       JSON.stringify({
//         sender: currentUser,
//         content: input,
//         roomId,
//       })
//     );
//     setInput("");
//   };

//   const handleTyping = () => {
//     stompRef.current.send(`/app/typing/${roomId}`, {}, currentUser);
//   };

//   const handleLogout = () => {
//     stompRef.current.send(`/app/leave/${roomId}`, {}, currentUser);
//     logout();
//     navigate("/login");
//   };

//   const getPrivateRoom = (u1, u2) =>
//     [u1, u2].sort().join("_");

//   return (
//     <div className="flex flex-col h-screen bg-slate-800 text-gray-300">

//       {/* HEADER */}
//       <div className="flex justify-between p-3 bg-gray-900">
//         <span>Room: {roomId}</span>
//         <span>{users.join(", ")}</span>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-3">
//         {messages.map((msg, i) => (
//           <div key={i} className="mb-2">
//             <p className="text-xs">{msg.sender}</p>
//             <p>{msg.content}</p>

//             {msg.sender === currentUser && (
//               <span className="text-xs">
//                 {msg.seen ? "✔✔" : "✔"}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* TYPING */}
//       {typingUser && (
//         <p className="text-xs px-3 animate-pulse">
//           {typingUser} is typing...
//         </p>
//       )}

//       {/* INPUT
//       <div className="flex p-3 bg-gray-900">
//         <input
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value);
//             handleTyping();
//           }}
//           className="flex-1 px-2"
//         />
//         <button onClick={sendMessage}>
//           <MdSend />
//         </button>
//       </div> */}

//       <div className="w-full bg-gray-900 p-3 flex items-center gap-2">

//   {/* INPUT */}
//   <input
//     value={input}
//     onChange={(e) => {
//       setInput(e.target.value);
//       handleTyping();
//     }}
//     onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//     placeholder="Type your message..."
//     className="flex-1 min-w-0 px-4 py-2 rounded-full bg-gray-700 text-white outline-none"
//   />

//   {/* SEND BUTTON */}
//   <button
//     onClick={sendMessage}
//     className="flex-shrink-0 bg-green-500 hover:bg-green-600 p-2 rounded-full text-white"
//   >
//     <MdSend size={20} />
//   </button>

// </div>
      
//     </div>
//   );
// };

// export default ChatPage;


import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const { roomId, currentUser, connected } = useChatContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);

  const stompRef = useRef(null);
  // ✅ Feature: Scroll to bottom
  const messagesEndRef = useRef(null);

  // ✅ Redirect if not connected
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  // ✅ Feature: Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Feature: Load message history on join
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getMessagess(roomId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load message history", err);
      }
    }
    if (roomId) loadHistory();
  }, [roomId]);

  useEffect(() => {
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      stompRef.current = client;

      // messages
      client.subscribe(`/topic/room/${roomId}`, (msg) => {
        setMessages((prev) => [...prev, JSON.parse(msg.body)]);
      });

      // typing
      client.subscribe(`/topic/typing/${roomId}`, (msg) => {
        const user = msg.body;
        if (user !== currentUser) {
          setTypingUser(user);
          setTimeout(() => setTypingUser(""), 2000);
        }
      });

      // users
      client.subscribe(`/topic/users/${roomId}`, (msg) => {
        setUsers(JSON.parse(msg.body));
      });

      // seen
      client.subscribe(`/topic/seen/${roomId}`, (msg) => {
        const id = msg.body;
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, seen: true } : m))
        );
      });

      // private
      client.subscribe(`/topic/private`, (msg) => {
        const message = JSON.parse(msg.body);
        if (message.roomId.includes(currentUser)) {
          setMessages((prev) => [...prev, message]);
        }
      });

      client.send(`/app/join/${roomId}`, {}, currentUser);
    });

    return () => client.disconnect();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    stompRef.current.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify({
        sender: currentUser,
        content: input,
        roomId,
      })
    );
    setInput("");
  };

  const handleTyping = () => {
    stompRef.current?.send(`/app/typing/${roomId}`, {}, currentUser);
  };

  const handleLogout = () => {
    stompRef.current?.send(`/app/leave/${roomId}`, {}, currentUser);
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-800 text-gray-300">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">Room</span>
          <span className="font-semibold text-white">{roomId}</span>
        </div>

        {/* ✅ Feature: Online user count badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-300">
            <span className="font-semibold text-white">{users.length}</span> online
          </span>
          {users.length > 0 && (
            <span className="text-xs text-gray-500 hidden sm:inline">
              ({users.join(", ")})
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-xs bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full text-white transition"
        >
          Logout
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* ✅ Feature: Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-2">
            <span className="text-4xl">👋</span>
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.sender === currentUser;
          return (
            <div
              key={i}
              className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
            >
              {/* Sender name (only for others) */}
              {!isOwn && (
                <span className="text-xs text-gray-400 mb-1 px-1">{msg.sender}</span>
              )}

              <div
                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  isOwn
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-gray-700 text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* ✅ Feature: Timestamp + seen receipt */}
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-xs text-gray-500">
                  {timeAgo(msg.timestamp)}
                </span>
                {isOwn && (
                  <span className="text-xs text-gray-400">
                    {msg.seen ? "✔✔" : "✔"}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* ✅ Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* TYPING INDICATOR */}
      {typingUser && (
        <p className="text-xs px-4 pb-1 text-gray-400 animate-pulse">
          {typingUser} is typing...
        </p>
      )}

      {/* INPUT */}
      <div className="w-full bg-gray-900 p-3 flex items-center gap-2 border-t border-gray-700">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 min-w-0 px-4 py-2 rounded-full bg-gray-700 text-white outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="flex-shrink-0 bg-green-500 hover:bg-green-600 p-2 rounded-full text-white transition"
        >
          <MdSend size={20} />
        </button>
      </div>

    </div>
  );
};

export default ChatPage;