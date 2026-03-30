import { Navigate } from "react-router";
import useAuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authUser, authLoading } = useAuthContext();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-800">
        <p className="text-gray-400 text-sm">Checking session...</p>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;