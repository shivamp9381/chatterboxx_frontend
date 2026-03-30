// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import { BrowserRouter } from "react-router";
// import AppRoutes from "./config/routes.jsx";
// import { Toaster } from "react-hot-toast";
// import { ChatProvider } from "./context/ChatContext.jsx";
// import ChatPage from "./components/ChatPage.jsx";

// // createRoot(document.getElementById("root")).render(
// //   <BrowserRouter>
// //     <Toaster position="top-center" />
// //     <ChatProvider>
// //       <AppRoutes />
// //     </ChatProvider>
// //   </BrowserRouter>

// // );


// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <Toaster position="top-center" />
//     <ChatProvider>
//       <AppRoutes />
//     </ChatProvider>
//   </BrowserRouter>
// );


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoutes from "./config/routes.jsx";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-center" />
    <AuthProvider>       {/* ✅ outer — handles JWT/session */}
      <ChatProvider>     {/* ✅ inner — handles room/connection state */}
        <AppRoutes />
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);