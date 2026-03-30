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

//   // Auto-scroll on new messages
//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Connect WebSocket
//   useEffect(() => {
//     if (!connected || !roomId) return;

//     const sock = new SockJS(`${baseURL}/chat`);
//     const client = Stomp.over(sock);

//     // Suppress STOMP console noise
//     client.debug = () => {};

//     client.connect({}, () => {
//       setStompClient(client);
//       toast.success("Connected to room!");

//       client.subscribe(`/topic/room/${roomId}`, (message) => {
//         const newMessage = JSON.parse(message.body);
//         setMessages((prev) => [...prev, newMessage]);
//       });
//     }, (error) => {
//       console.error("WebSocket error:", error);
//       toast.error("Connection failed. Please rejoin.");
//     });

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

//   // // Leave room
//   // const handleLogout = () => {
//   //   if (stompClient && stompClient.connected) {
//   //     stompClient.disconnect();
//   //   }
//   //   setConnected(false);
//   //   setRoomId("");
//   //   setCurrentUser("");
//   //   navigate("/");
//   // };

// const handleLogout = () => {
//   if (stompClient && stompClient.connected) {
//     stompClient.disconnect();
//   }
//   setConnected(false);
//   setRoomId("");
//   setCurrentUser("");
//   logout();           // ✅ clears JWT from localStorage + AuthContext
//   navigate("/login"); // ✅ send to login instead of "/"
// };

//   return (
//     <div className="flex flex-col h-screen dark:bg-slate-800 text-white">

//       {/* Header */}
//       <header className="flex justify-between items-center px-6 py-4 bg-gray-900 shadow-md">
//         <h1 className="font-semibold text-lg">
//           Room: <span className="text-blue-400">{roomId}</span>
//         </h1>
//         <h1 className="font-semibold text-lg">
//           User: <span className="text-green-400">{currentUser}</span>
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-700 px-4 py-1.5 rounded-full text-sm transition"
//         >
//           Leave Room
//         </button>
//       </header>

//       {/* Messages */}
//       <div
//         ref={chatBoxRef}
//         className="flex-1 overflow-y-auto p-6 space-y-3 dark:bg-slate-700"
//       >
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               message.sender === currentUser ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`p-3 rounded-lg max-w-xs shadow ${
//                 message.sender === currentUser
//                   ? "bg-green-600"
//                   : "bg-gray-700"
//               }`}
//             >
//               <p className="text-xs font-bold mb-1 opacity-80">
//                 {message.sender}
//               </p>
//               <p className="text-sm">{message.content}</p>
//               {/* ✅ Fixed: was message.timeStamp (capital S), backend sends timestamp */}
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
//       <div className="flex items-center gap-2 p-4 bg-gray-900 border-t border-gray-700">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           type="text"
//           placeholder="Type your message..."
//           className="flex-1 px-4 py-2 rounded-full bg-gray-800 outline-none text-white placeholder-gray-400"
//         />

//         <button
//           title="Attach file"
//           className="bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition"
//         >
//           <MdAttachFile size={20} />
//         </button>

//         <button
//           onClick={sendMessage}
//           title="Send message"
//           className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition"
//         >
//           <MdSend size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
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

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Redirect if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected]);

  // Load existing messages
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await getMessagess(roomId);
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    }

    if (connected && roomId) {
      loadMessages();
    }
  }, [connected, roomId]);

  // Auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.debug = () => {};

    client.connect(
      {},
      () => {
        setStompClient(client);
        toast.success("Connected to room!");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      },
      (error) => {
        console.error("WebSocket error:", error);
        toast.error("Connection failed. Please rejoin.");
      }
    );

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [roomId, connected]);

  // Send message
  const sendMessage = () => {
    if (!stompClient || !stompClient.connected || !input.trim()) return;

    const message = {
      sender: currentUser,
      content: input.trim(),
      roomId: roomId,
    };

    stompClient.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify(message)
    );

    setInput("");
  };

  // Leave room
  const handleLogout = () => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full bg-slate-800 text-white">

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-3 bg-gray-900 shadow-md">
        <h1 className="text-sm sm:text-lg">
          Room: <span className="text-blue-400">{roomId}</span>
        </h1>

        <h1 className="text-sm sm:text-lg">
          User: <span className="text-green-400">{currentUser}</span>
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full text-xs sm:text-sm w-fit"
        >
          Leave Room
        </button>
      </header>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 bg-slate-700"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === currentUser
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[75%] sm:max-w-md break-words shadow ${
                message.sender === currentUser
                  ? "bg-green-600"
                  : "bg-gray-700"
              }`}
            >
              <p className="text-xs font-bold mb-1 opacity-80">
                {message.sender}
              </p>
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-300 mt-1">
                {timeAgo(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            No messages yet. Say hello! 👋
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 sm:p-4 bg-gray-900 border-t border-gray-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          type="text"
          placeholder="Type your message..."
          className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gray-800 outline-none text-white placeholder-gray-400 text-sm sm:text-base"
        />

        <button
          title="Attach file"
          className="shrink-0 bg-purple-600 hover:bg-purple-700 p-2 rounded-full"
        >
          <MdAttachFile size={18} />
        </button>

        <button
          onClick={sendMessage}
          title="Send message"
          className="shrink-0 bg-green-600 hover:bg-green-700 p-2 rounded-full"
        >
          <MdSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;