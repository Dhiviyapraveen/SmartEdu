import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";


export default function Login() {
      const [loginData, setLoginData] = useState({
        email: "",
        password: ""
        });
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const res = await api.post("/auth/login", loginData);

        if (res.data.success) {
          alert("Login successful!");

          login(res.data.token);
          navigate("/dashboard");
        } else {
        alert(res.data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-10">
        <button
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-purple-400 font-semibold"
        >
          <FaArrowLeft />
          Back
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 rounded-xl text-white font-bold hover:bg-purple-400 transition shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          Don't have an account?{" "}
          <span
            className="text-purple-400 font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}