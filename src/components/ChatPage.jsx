// import React, { useEffect, useRef, useState } from "react";
// import { MdSend } from "react-icons/md";
// import useChatContext from "../context/ChatContext";
// import useAuthContext from "../context/AuthContext";
// import { useNavigate } from "react-router";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";
// import { baseURL } from "../config/AxiosHelper";
// import { getMessagess } from "../services/RoomService";
// import { timeAgo } from "../config/helper";

// const ChatPage = () => {
//   const { roomId, currentUser, connected } = useChatContext();
//   const { logout } = useAuthContext();
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [typingUser, setTypingUser] = useState("");
//   const [users, setUsers] = useState([]);

//   const stompRef = useRef(null);
//   // ✅ Feature: Scroll to bottom
//   const messagesEndRef = useRef(null);

//   // ✅ Redirect if not connected
//   useEffect(() => {
//     if (!connected) navigate("/");
//   }, [connected]);

//   // ✅ Feature: Auto-scroll whenever messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Feature: Load message history on join
//   useEffect(() => {
//     async function loadHistory() {
//       try {
//         const history = await getMessagess(roomId);
//         setMessages(history);
//       } catch (err) {
//         console.error("Failed to load message history", err);
//       }
//     }
//     if (roomId) loadHistory();
//   }, [roomId]);

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
//           prev.map((m) => (m.id === id ? { ...m, seen: true } : m))
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
//     if (!input.trim()) return;
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
//     stompRef.current?.send(`/app/typing/${roomId}`, {}, currentUser);
//   };

//   const handleLogout = () => {
//     stompRef.current?.send(`/app/leave/${roomId}`, {}, currentUser);
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex flex-col h-screen bg-slate-800 text-gray-300">

//       {/* HEADER */}
//       <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-700">
//         <div className="flex flex-col">
//           <span className="text-sm text-gray-400">Room</span>
//           <span className="font-semibold text-white">{roomId}</span>
//         </div>

//         {/* ✅ Feature: Online user count badge */}
//         <div className="flex items-center gap-2">
//           <span className="relative flex h-2.5 w-2.5">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
//           </span>
//           <span className="text-sm text-gray-300">
//             <span className="font-semibold text-white">{users.length}</span> online
//           </span>
//           {users.length > 0 && (
//             <span className="text-xs text-gray-500 hidden sm:inline">
//               ({users.join(", ")})
//             </span>
//           )}
//         </div>

//         <button
//           onClick={handleLogout}
//           className="text-xs bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full text-white transition"
//         >
//           Logout
//         </button>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">

//         {/* ✅ Feature: Empty state */}
//         {messages.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-2">
//             <span className="text-4xl">👋</span>
//             <p className="text-sm">No messages yet. Say hello!</p>
//           </div>
//         )}

//         {messages.map((msg, i) => {
//           const isOwn = msg.sender === currentUser;
//           return (
//             <div
//               key={i}
//               className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
//             >
//               {/* Sender name (only for others) */}
//               {!isOwn && (
//                 <span className="text-xs text-gray-400 mb-1 px-1">{msg.sender}</span>
//               )}

//               <div
//                 className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm ${
//                   isOwn
//                     ? "bg-green-600 text-white rounded-br-sm"
//                     : "bg-gray-700 text-gray-200 rounded-bl-sm"
//                 }`}
//               >
//                 {msg.content}
//               </div>

//               {/* ✅ Feature: Timestamp + seen receipt */}
//               <div className="flex items-center gap-1 mt-1 px-1">
//                 <span className="text-xs text-gray-500">
//                   {timeAgo(msg.timestamp)}
//                 </span>
//                 {isOwn && (
//                   <span className="text-xs text-gray-400">
//                     {msg.seen ? "✔✔" : "✔"}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         {/* ✅ Auto-scroll anchor */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* TYPING INDICATOR */}
//       {typingUser && (
//         <p className="text-xs px-4 pb-1 text-gray-400 animate-pulse">
//           {typingUser} is typing...
//         </p>
//       )}

//       {/* INPUT */}
//       <div className="w-full bg-gray-900 p-3 flex items-center gap-2 border-t border-gray-700">
//         <input
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value);
//             handleTyping();
//           }}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//           className="flex-1 min-w-0 px-4 py-2 rounded-full bg-gray-700 text-white outline-none text-sm"
//         />
//         <button
//           onClick={sendMessage}
//           className="flex-shrink-0 bg-green-500 hover:bg-green-600 p-2 rounded-full text-white transition"
//         >
//           <MdSend size={20} />
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ChatPage;


import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdSend, MdSearch, MdClose } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

const ChatPage = () => {
  const { roomId, currentUser, connected } = useChatContext();
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [users, setUsers] = useState([]);

  // ✅ Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Unread badge
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // ✅ Reactions: which message's picker is open
  const [pickerOpenFor, setPickerOpenFor] = useState(null);

  const stompRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ─── Navigation guard ───────────────────────────────────────────────────
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected]);

  // ─── Auto-scroll + unread logic ─────────────────────────────────────────
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  }, [messages, isAtBottom]);

  // ✅ Detect whether the user is scrolled to the bottom
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setUnreadCount(0);
  }, []);

  // ─── Load message history ────────────────────────────────────────────────
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

  // ─── WebSocket ───────────────────────────────────────────────────────────
  useEffect(() => {
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      stompRef.current = client;

      // messages
      client.subscribe(`/topic/room/${roomId}`, (msg) => {
        const incoming = JSON.parse(msg.body);
        setMessages((prev) => [...prev, incoming]);
        // ✅ Increment unread if user is scrolled up
        setIsAtBottom((atBottom) => {
          if (!atBottom) setUnreadCount((c) => c + 1);
          return atBottom;
        });
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

      // ✅ Reactions: update the specific message in state
      client.subscribe(`/topic/reactions/${roomId}`, (msg) => {
        const updated = JSON.parse(msg.body);
        if (!updated) return;
        setMessages((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
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

  // ─── Send message ────────────────────────────────────────────────────────
  const sendMessage = () => {
    if (!input.trim() || !stompRef.current) return;
    stompRef.current.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify({ sender: currentUser, content: input, roomId })
    );
    setInput("");
  };

  // ─── Typing indicator ────────────────────────────────────────────────────
  const handleTyping = () => {
    stompRef.current?.send(`/app/typing/${roomId}`, {}, currentUser);
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    stompRef.current?.send(`/app/leave/${roomId}`, {}, currentUser);
    logout();
    navigate("/login");
  };

  // ─── React to message ────────────────────────────────────────────────────
  const sendReaction = (messageId, emoji) => {
    stompRef.current?.send(
      `/app/react/${roomId}`,
      {},
      JSON.stringify({ messageId, emoji, username: currentUser })
    );
    setPickerOpenFor(null);
  };

  // ─── Scroll to bottom manually ───────────────────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setUnreadCount(0);
    setIsAtBottom(true);
  };

  // ─── Filtered messages for search ───────────────────────────────────────
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) =>
        m.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sender?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Helper: highlight matching text in search results
  const highlight = (text) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-400 text-gray-900 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-800 text-gray-300">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Room</span>
          <span className="font-semibold text-white text-sm">{roomId}</span>
        </div>

        {/* Online badge */}
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

        <div className="flex items-center gap-2">
          {/* ✅ Search toggle button */}
          <button
            onClick={() => { setSearchOpen((o) => !o); setSearchQuery(""); }}
            className="text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-gray-700"
            title="Search messages"
          >
            <MdSearch size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="text-xs bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Search bar (slides in below header) */}
      {searchOpen && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <MdSearch size={16} className="text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages or senders..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
          {searchQuery && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {filteredMessages.length} result{filteredMessages.length !== 1 ? "s" : ""}
            </span>
          )}
          <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            className="text-gray-400 hover:text-white">
            <MdClose size={16} />
          </button>
        </div>
      )}

      {/* ── MESSAGES ───────────────────────────────────────────────────── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3 relative"
      >
        {/* Empty state */}
        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-2">
            <span className="text-4xl">{searchQuery ? "🔍" : "👋"}</span>
            <p className="text-sm">
              {searchQuery ? `No messages matching "${searchQuery}"` : "No messages yet. Say hello!"}
            </p>
          </div>
        )}

        {filteredMessages.map((msg, i) => {
          const isOwn = msg.sender === currentUser;
          return (
            <div
              key={msg.id || i}
              className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
            >
              {/* Sender name */}
              {!isOwn && (
                <span className="text-xs text-gray-400 mb-1 px-1">{msg.sender}</span>
              )}

              {/* Bubble + reaction picker trigger */}
              <div className={`flex items-end gap-1.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`relative max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-gray-700 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {searchQuery ? highlight(msg.content) : msg.content}
                </div>

                {/* ✅ Emoji reaction button */}
                <button
                  onClick={() => setPickerOpenFor(pickerOpenFor === msg.id ? null : msg.id)}
                  className="text-base text-gray-500 hover:text-gray-300 transition flex-shrink-0 leading-none"
                  title="React"
                >
                  😊
                </button>
              </div>

              {/* ✅ Emoji picker popup */}
              {pickerOpenFor === msg.id && (
                <div className={`flex gap-1 mt-1 bg-gray-800 border border-gray-600 rounded-full px-2 py-1 shadow-lg ${isOwn ? "mr-8" : "ml-8"}`}>
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => sendReaction(msg.id, emoji)}
                      className="text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* ✅ Reaction counts */}
              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? "mr-8" : "ml-8"}`}>
                  {Object.entries(msg.reactions).map(([emoji, users]) =>
                    users.length > 0 ? (
                      <button
                        key={emoji}
                        onClick={() => sendReaction(msg.id, emoji)}
                        title={[...users].join(", ")}
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition ${
                          users.includes(currentUser)
                            ? "bg-green-700 border-green-500 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{users.length}</span>
                      </button>
                    ) : null
                  )}
                </div>
              )}

              {/* Timestamp + seen */}
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-xs text-gray-500">{timeAgo(msg.timestamp)}</span>
                {isOwn && (
                  <span className="text-xs text-gray-400">{msg.seen ? "✔✔" : "✔"}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Unread messages badge */}
      {unreadCount > 0 && (
        <div className="flex justify-center pb-1">
          <button
            onClick={scrollToBottom}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-1.5 rounded-full shadow-lg transition flex items-center gap-1.5"
          >
            <span>↓</span>
            <span>{unreadCount} new message{unreadCount !== 1 ? "s" : ""}</span>
          </button>
        </div>
      )}

      {/* Typing indicator */}
      {typingUser && (
        <p className="text-xs px-4 pb-1 text-gray-400 animate-pulse">
          {typingUser} is typing...
        </p>
      )}

      {/* ── INPUT ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gray-900 p-3 flex items-center gap-2 border-t border-gray-700">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); handleTyping(); }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 min-w-0 px-4 py-2 rounded-full bg-gray-700 text-white outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="flex-shrink-0 bg-green-500 hover:bg-green-600 p-2 rounded-full text-white transition"
        >
          <MdSearch size={20} className="hidden" />
          <MdSend size={20} />
        </button>
      </div>

    </div>
  );
};

export default ChatPage;