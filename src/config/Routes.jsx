// // import React from "react";
// // import { Routes, Route } from "react-router";
// // import App from "../App";
// // import ChatPage from "../components/ChatPage";
// // const AppRoutes = () => {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<App />} />
// //       <Route path="/chat" element={<ChatPage />} />
// //       <Route path="/about" element={<h1>This is about page</h1>} />
// //       <Route path="*" element={<h1>404 Page Not Found</h1>} />
// //     </Routes>
// //   );
// // };

// // export default AppRoutes;

// // import React from "react";
// // import { Routes, Route } from "react-router";
// // import JoinCreateChat from "../components/JoinCreateChat";
// // import ChatPage from "../components/ChatPage";

// // const AppRoutes = () => {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<JoinCreateChat />} />
// //       <Route path="/chat" element={<ChatPage />} />
// //       <Route path="/about" element={<h1>This is about page</h1>} />
// //       <Route path="*" element={<h1>404 Page Not Found</h1>} />
// //     </Routes>
// //   );
// // };

// // export default AppRoutes;

// import { Routes, Route } from "react-router";
// import JoinCreateChat from "../components/JoinCreateChat";
// import ChatPage from "../components/ChatPage";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<JoinCreateChat />} />
//       <Route path="/chat" element={<ChatPage />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router";
import JoinCreateChat from "../components/JoinCreateChat";
import ChatPage from "../components/ChatPage";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — JWT required */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <JoinCreateChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;