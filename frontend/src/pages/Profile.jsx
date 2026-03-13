// Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaGraduationCap, FaStar, FaAward, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { token, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passMsg, setPassMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setUserData(res.data.user);
        } else {
          setError(res.data.message || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassMsg(res.data.message || "Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPassMsg(err.response?.data?.message || "Failed to update password");
    }
  };

  if (loading) return <p className="text-white p-8 text-xl">Loading profile...</p>;

  if (error)
    return (
      <div className="p-8 text-white">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-400 transition"
          onClick={() => navigate("/")}
        >
          Go to Login
        </button>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-8 flex flex-col">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-purple-400 hover:text-purple-200 transition"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Full-width profile container */}
      <div className="flex flex-col md:flex-row flex-1 gap-8 w-full h-full">
        {/* Left Panel: User Info + Change Password */}
        <div className="flex-1 flex flex-col gap-8 w-full">
          {/* User Info */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 w-full flex flex-col gap-6">
            <h2 className="text-4xl font-bold mb-4">👤 {userData.username || "Student Profile"}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="flex items-center gap-4 bg-gray-700 p-5 rounded-2xl shadow hover:shadow-lg transition">
                <FaUser className="text-purple-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white font-semibold">{userData.username || "Not set"}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 bg-gray-700 p-5 rounded-2xl shadow hover:shadow-lg transition">
                <FaEnvelope className="text-purple-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{userData.email || "Not set"}</p>
                </div>
              </div>

              {/* Grade */}
              <div className="flex items-center gap-4 bg-gray-700 p-5 rounded-2xl shadow hover:shadow-lg transition">
                <FaGraduationCap className="text-purple-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Grade</p>
                  <p className="text-white font-semibold">{userData.grade || "Not set"}</p>
                </div>
              </div>

              {/* Interests */}
              <div className="flex flex-col bg-gray-700 p-5 rounded-2xl shadow hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-2">
                  <FaStar className="text-purple-400 text-2xl" />
                  <p className="text-gray-400 text-sm">Interests</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {userData.interestedSubjects && userData.interestedSubjects.length > 0 ? (
                    userData.interestedSubjects.map((interest, idx) => (
                      <span key={idx} className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400">No interests selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gray-800 rounded-3xl shadow-2xl p-10 w-full flex flex-col gap-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaLock /> Change Password
            </h3>

            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="Current Password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="password"
                placeholder="New Password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {passMsg && <p className="text-green-400">{passMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 hover:bg-purple-400 rounded-2xl font-bold transition shadow-lg"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Badges */}
        <div className="flex-1 bg-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-4">
            <FaAward className="text-yellow-400 text-2xl" />
            <h3 className="text-white font-bold text-lg">Earned Badges</h3>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {userData.badges && userData.badges.length > 0 ? (
              userData.badges.map((badge, idx) => (
                <span key={idx} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow">
                  {badge}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No badges earned yet</p>
            )}
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-auto py-3 bg-red-500 hover:bg-red-600 rounded-2xl font-bold transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}