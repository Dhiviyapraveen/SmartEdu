import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaBrain, FaRocket } from "react-icons/fa";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProfileSetup() {

  const navigate = useNavigate();
  const { user, token } = useAuth();

  const interests = [
    { name: "Artificial Intelligence", icon: <FaBrain /> },
    { name: "Robotics", icon: <FaRobot /> },
    { name: "Drone Technology", icon: <FaRocket /> },
  ];

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = async () => {

    if (selected.length === 0) {
      alert("Select at least one interest");
      return;
    }

    setLoading(true);

    try {
      // Save interests to the user collection
      const res = await fetch("/api/profile/save-interests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          interests: selected 
        })
      });

      const data = await res.json();
      
      if (data.success) {
        navigate("/dashboard");
      } else {
        alert(data.message || "Error saving interests");
      }

    } catch (err) {
      console.error(err);
      alert("Session expired or server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-6">

      <div className="bg-gray-800 p-10 rounded-3xl shadow-xl max-w-3xl w-full">

        <h2 className="text-3xl font-bold text-center mb-6">
          🎯 Choose Your Interests
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {interests.map((interest) => (
            <div
              key={interest.name}
              onClick={() => toggleInterest(interest.name)}
              className={`p-6 rounded-2xl cursor-pointer transition
              ${
                selected.includes(interest.name)
                  ? "bg-purple-600 scale-105"
                  : "bg-gray-700 hover:scale-105"
              }`}
            >
              <div className="text-3xl mb-2">{interest.icon}</div>
              <h3>{interest.name}</h3>
            </div>
          ))}

        </div>

        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-8 w-full py-3 bg-purple-500 rounded-xl font-bold"
        >
          {loading ? "Loading..." : "Continue →"}
        </button>

      </div>
    </div>
  );
}