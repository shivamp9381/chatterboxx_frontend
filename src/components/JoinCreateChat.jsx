// import React, { useState } from "react";
// import chatIcon from "../assets/chat.png";
// import toast from "react-hot-toast";
// import { createRoomApi, joinChatApi } from "../services/RoomService";
// import useChatContext from "../context/ChatContext";
// import { useNavigate } from "react-router";

// const JoinCreateChat = () => {
//   const [detail, setDetail] = useState({
//     roomId: "",
//     userName: "",
//   });

//   const { setRoomId, setCurrentUser, setConnected } = useChatContext();
//   const navigate = useNavigate();

//   function handleFormInputChange(event) {
//     setDetail({
//       ...detail,
//       [event.target.name]: event.target.value,
//     });
//   }

//   function validateForm() {
//     if (!detail.roomId.trim() || !detail.userName.trim()) {
//       toast.error("Please enter both name and room ID");
//       return false;
//     }
//     return true;
//   }

//   async function joinChat() {
//     if (!validateForm()) return;

//     try {
//       const room = await joinChatApi(detail.roomId);
//       toast.success("Joined room!");
//       setCurrentUser(detail.userName);
//       setRoomId(room.roomId);
//       setConnected(true);
//       navigate("/chat");
//     } catch (error) {
//       if (error.response?.status === 400) {
//         toast.error(error.response.data);
//       } else {
//         toast.error("Error joining room");
//       }
//     }
//   }

//   async function createRoom() {
//     if (!validateForm()) return;

//     try {
//       const response = await createRoomApi(detail.roomId);
//       toast.success("Room created!");
//       setCurrentUser(detail.userName);
//       setRoomId(response.roomId);
//       setConnected(true);
//       navigate("/chat");
//     } catch (error) {
//       if (error.response?.status === 400) {
//         toast.error("Room already exists!");
//       } else {
//         toast.error("Error creating room");
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center dark:bg-slate-800">
//       <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow-lg">
//         <div>
//           <img src={chatIcon} className="w-24 mx-auto" alt="Chat" />
//         </div>

//         <h1 className="text-2xl font-semibold text-center text-white">
//           Join or Create a Room
//         </h1>

//         <div>
//           <label className="block font-medium mb-2 text-gray-300">
//             Your Name
//           </label>
//           <input
//             onChange={handleFormInputChange}
//             value={detail.userName}
//             type="text"
//             name="userName"
//             placeholder="Enter your name"
//             className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-2 text-gray-300">
//             Room ID
//           </label>
//           <input
//             name="roomId"
//             onChange={handleFormInputChange}
//             value={detail.roomId}
//             type="text"
//             placeholder="Enter room ID"
//             className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex justify-center gap-3 mt-2">
//           <button
//             onClick={joinChat}
//             className="px-5 py-2 bg-blue-500 hover:bg-blue-700 rounded-full text-white transition"
//           >
//             Join Room
//           </button>
//           <button
//             onClick={createRoom}
//             className="px-5 py-2 bg-orange-500 hover:bg-orange-700 rounded-full text-white transition"
//           >
//             Create Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JoinCreateChat;


import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import useAuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const { logout, authUser } = useAuthContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (!detail.roomId.trim() || !detail.userName.trim()) {
      toast.error("Please enter both name and room ID");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (!validateForm()) return;

    try {
      const room = await joinChatApi(detail.roomId);
      toast.success("Joined room!");
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data || "Error joining room");
    }
  }

  async function createRoom() {
    if (!validateForm()) return;

    try {
      const response = await createRoomApi(detail.roomId);
      toast.success("Room created!");
      setCurrentUser(detail.userName);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data || "Error creating room");
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4">

      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6 sm:p-10 flex flex-col gap-5">

        {/* 🔥 Header with logout */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-sm sm:text-base">
            Logged in as <span className="text-green-400">{authUser?.username}</span>
          </h2>

          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full"
          >
            Logout
          </button>
        </div>

        <img src={chatIcon} className="w-16 sm:w-24 mx-auto" alt="Chat" />

        <h1 className="text-xl sm:text-2xl font-semibold text-center text-white">
          Join or Create a Room
        </h1>

        <div>
          <label className="text-gray-300 text-sm">Your Name</label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            name="userName"
            type="text"
            placeholder="Enter your name"
            className="w-full mt-1 px-3 py-2 rounded-full bg-gray-700 text-white outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Room ID</label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            placeholder="Enter room ID"
            className="w-full mt-1 px-3 py-2 rounded-full bg-gray-700 text-white outline-none text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={joinChat}
            className="w-full bg-blue-500 hover:bg-blue-700 py-2 rounded-full text-sm"
          >
            Join Room
          </button>

          <button
            onClick={createRoom}
            className="w-full bg-orange-500 hover:bg-orange-700 py-2 rounded-full text-sm"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;