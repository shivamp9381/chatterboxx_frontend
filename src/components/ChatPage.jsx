// import React, { useEffect, useRef, useState } from "react";
// import { MdAttachFile, MdSend } from "react-icons/md";
// import useChatContext from "../context/ChatContext";
// import useAuthContext from "../context/AuthContext";
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

//   const { logout } = useAuthContext();
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [users, setUsers] = useState([]);

//   const chatBoxRef = useRef(null);
//   const [stompClient, setStompClient] = useState(null);

//   // redirect
//   useEffect(() => {
//     if (!connected) navigate("/");
//   }, [connected]);

//   // load old messages
//   useEffect(() => {
//     if (connected && roomId) {
//       getMessagess(roomId).then(setMessages);
//     }
//   }, [connected, roomId]);

//   // auto scroll
//   useEffect(() => {
//     chatBoxRef.current?.scrollTo({
//       top: chatBoxRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   // websocket
//   useEffect(() => {
//     if (!connected || !roomId) return;

//     const sock = new SockJS(`${baseURL}/chat`);
//     const client = Stomp.over(sock);

//     client.connect({}, () => {
//       setStompClient(client);
//       toast.success("Connected!");

//       // 🔥 receive messages
//       client.subscribe(`/topic/room/${roomId}`, (msg) => {
//         const parsed = JSON.parse(msg.body);

//         console.log("Received FULL:", parsed);

//         setMessages((prev) => [
//           ...prev,
//           {
//             ...parsed,
//             content: parsed.content?.trim(),
//           },
//         ]);
//       });

//       // 🔥 users
//       client.subscribe(`/topic/users/${roomId}`, (msg) => {
//         setUsers(JSON.parse(msg.body));
//       });

//       // join
//       client.send(`/app/join/${roomId}`, {}, currentUser);
//     });

//     return () => client.disconnect();
//   }, [roomId, connected]);

//   // send text message
//   const sendMessage = () => {
//     if (!stompClient || !input.trim()) return;

//     stompClient.send(
//       `/app/sendMessage/${roomId}`,
//       {},
//       JSON.stringify({
//         sender: currentUser,
//         content: input.trim(),
//         roomId,
//       })
//     );

//     setInput("");
//   };

//   // 🔥 FILE UPLOAD FIXED COMPLETELY
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch(`${baseURL}/api/v1/files/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       let url = await res.text();

//       // 🔥 CRITICAL FIX
//       url = url.replace(/"/g, "").trim();

//       console.log("FINAL FILE URL:", url);

//       if (!url.includes("http")) {
//         toast.error("Upload failed");
//         return;
//       }

//       // 🔥 send to chat
//       stompClient.send(
//         `/app/sendMessage/${roomId}`,
//         {},
//         JSON.stringify({
//           sender: currentUser,
//           content: url,
//           roomId,
//         })
//       );

//       toast.success("File sent!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Upload failed");
//     }

//     e.target.value = "";
//   };

//   // logout
//   const handleLogout = () => {
//     stompClient?.send(`/app/leave/${roomId}`, {}, currentUser);
//     stompClient?.disconnect();

//     logout();
//     setConnected(false);
//     setRoomId("");
//     setCurrentUser("");

//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col h-screen max-w-3xl mx-auto bg-slate-800 text-white">

//       {/* HEADER */}
//       <header className="flex justify-between items-center p-3 bg-gray-900">
//         <h1 className="text-sm">
//           Room: <span className="text-blue-400">{roomId}</span>
//         </h1>

//         <p className="text-xs text-gray-400">
//           Online: {users.join(", ")}
//         </p>

//         <button
//           onClick={handleLogout}
//           className="bg-red-500 px-3 py-1 rounded text-xs"
//         >
//           Logout
//         </button>
//       </header>

//       {/* MESSAGES */}
//       <div
//         ref={chatBoxRef}
//         className="flex-1 overflow-y-auto p-3 space-y-2"
//       >
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${
//               msg.sender === currentUser
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div className="bg-gray-700 p-2 rounded max-w-[75%] break-words">
//               <p className="text-xs">{msg.sender}</p>

//               {/* 🔥 FINAL RENDER FIX */}
//               {msg.content && msg.content.includes("http") ? (
//                 msg.content.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                   <img
//                     src={msg.content}
//                     alt="file"
//                     className="max-w-xs rounded mt-1"
//                   />
//                 ) : (
//                   <a
//                     href={msg.content}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-blue-300 underline break-all"
//                   >
//                     📎 Open File
//                   </a>
//                 )
//               ) : (
//                 <p>{msg.content}</p>
//               )}

//               <p className="text-xs text-gray-400">
//                 {timeAgo(msg.timestamp)}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* INPUT */}
//       <div className="flex gap-2 p-3 bg-gray-900">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 px-3 py-2 rounded-full bg-gray-700 outline-none"
//           placeholder="Type message..."
//         />

//         <input
//           type="file"
//           hidden
//           id="fileInput"
//           onChange={handleFileUpload}
//         />

//         <button
//           onClick={() => document.getElementById("fileInput").click()}
//           className="bg-purple-600 p-2 rounded-full"
//         >
//           <MdAttachFile />
//         </button>

//         <button
//           onClick={sendMessage}
//           className="bg-green-600 p-2 rounded-full"
//         >
//           <MdSend />
//         </button>
//       </div>
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

const ChatPage = () => {
  const { roomId, currentUser, connected } = useChatContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);

  const stompRef = useRef(null);

  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

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
          prev.map((m) =>
            m.id === id ? { ...m, seen: true } : m
          )
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
    stompRef.current.send(`/app/typing/${roomId}`, {}, currentUser);
  };

  const handleLogout = () => {
    stompRef.current.send(`/app/leave/${roomId}`, {}, currentUser);
    logout();
    navigate("/login");
  };

  const getPrivateRoom = (u1, u2) =>
    [u1, u2].sort().join("_");

  return (
    <div className="flex flex-col h-screen bg-slate-800 text-gray-300">

      {/* HEADER */}
      <div className="flex justify-between p-3 bg-gray-900">
        <span>Room: {roomId}</span>
        <span>{users.join(", ")}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <p className="text-xs">{msg.sender}</p>
            <p>{msg.content}</p>

            {msg.sender === currentUser && (
              <span className="text-xs">
                {msg.seen ? "✔✔" : "✔"}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* TYPING */}
      {typingUser && (
        <p className="text-xs px-3 animate-pulse">
          {typingUser} is typing...
        </p>
      )}

      {/* INPUT
      <div className="flex p-3 bg-gray-900">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          className="flex-1 px-2"
        />
        <button onClick={sendMessage}>
          <MdSend />
        </button>
      </div> */}

      <div className="w-full bg-gray-900 p-3 flex items-center gap-2">

  {/* INPUT */}
  <input
    value={input}
    onChange={(e) => {
      setInput(e.target.value);
      handleTyping();
    }}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Type your message..."
    className="flex-1 min-w-0 px-4 py-2 rounded-full bg-gray-700 text-white outline-none"
  />

  {/* SEND BUTTON */}
  <button
    onClick={sendMessage}
    className="flex-shrink-0 bg-green-500 hover:bg-green-600 p-2 rounded-full text-white"
  >
    <MdSend size={20} />
  </button>

</div>
      
    </div>
  );
};

export default ChatPage;