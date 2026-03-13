import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Register() {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    grade: ""
  });
  const { login } = useAuth();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("Sending data:", registerData);

    try {
      const res = await api.post("/auth/register", registerData);

      if (res.data.success) {
        alert("Registration successful!");
        login(res.data.token);
        navigate("/profile-setup");
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      console.log("Backend error:", error.response?.data);
      alert(error.response?.data?.message || "Registration failed");
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
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Username */}
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              required
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  name: e.target.value
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              required
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Grade Dropdown */}
          <div className="relative">
            <FaGraduationCap className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <select
              required
              value={registerData.grade}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  grade: Number(e.target.value)
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              <option value="">Select Grade</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
            </select>
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value
                })
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 rounded-xl text-white font-bold hover:bg-purple-400 transition shadow-lg"
          >
            Register
          </button>

        </form>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <span
            className="text-purple-400 font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
