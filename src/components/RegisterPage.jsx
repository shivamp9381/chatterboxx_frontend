import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import chatIcon from "../assets/chat.png";
import { registerApi } from "../services/AuthService";
import useAuthContext from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.username.trim() || !form.password.trim() || !form.confirm.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await registerApi(form.username, form.password);
      login(data.token, data.username);
      toast.success(`Account created! Welcome, ${data.username}!`);
      navigate("/");
    } catch (error) {
      const msg = error.response?.data || "Registration failed";
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
          Create your account
        </h1>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            placeholder="Choose a username"
            className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="At least 6 characters"
            className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
          <input
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            type="password"
            placeholder="Re-enter your password"
            className="w-full dark:bg-gray-700 text-white px-4 py-2 border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-2 bg-orange-500 hover:bg-orange-700 disabled:opacity-50 rounded-full text-white font-medium transition"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;