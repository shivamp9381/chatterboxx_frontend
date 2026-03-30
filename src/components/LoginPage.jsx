import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { loginApi } from "../services/AuthService";
import useAuthContext from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.username.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(form.username, form.password);
      login(data.token, data.username);
      toast.success(`Welcome back, ${data.username}!`);
      navigate("/");
    } catch (error) {
      const msg = error.response?.data || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-800">
      <div className="p-10 w-full max-w-md rounded dark:bg-gray-900 border dark:border-gray-700 shadow-lg flex flex-col gap-5">

        <img src={chatIcon} className="w-20 mx-auto" alt="Chat" />

        <h1 className="text-2xl font-semibold text-center text-white">
          Sign in to ChatterBoxx
        </h1>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            type="text"
            placeholder="Enter your username"
            className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            type="password"
            placeholder="Enter your password"
            className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 rounded-full text-white font-medium transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;