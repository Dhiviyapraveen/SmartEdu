import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaBrain, FaRocket, FaGamepad, FaMicrochip } from "react-icons/fa";

export default function ProfileSetup() {

  const navigate = useNavigate();

  const interests = [
    { name: "Artificial Intelligence", icon: <FaBrain /> },
    { name: "Robotics", icon: <FaRobot /> },
    { name: "Drone Technology", icon: <FaRocket /> },
    { name: "Game Development", icon: <FaGamepad /> },
    { name: "Electronics", icon: <FaMicrochip /> },
  ];

  const [selected, setSelected] = useState([]);

  const toggleInterest = (interest) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter((i) => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  const handleContinue = () => {
    console.log("Selected Interests:", selected);

    // send to backend later

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-6">

      <div className="bg-gray-800 p-10 rounded-3xl shadow-xl max-w-3xl w-full">

        <h2 className="text-3xl font-bold mb-4 text-center">
          🎯 Choose Your Interests
        </h2>

        <p className="text-gray-400 text-center mb-8">
          Select topics you want to explore. We will personalize your learning path.
        </p>

        {/* Interest Grid */}

        <div className="grid md:grid-cols-3 gap-6">

          {interests.map((interest) => (
            <div
              key={interest.name}
              onClick={() => toggleInterest(interest.name)}
              className={`cursor-pointer p-6 rounded-2xl border transition-all
              ${
                selected.includes(interest.name)
                  ? "bg-purple-600 border-purple-400"
                  : "bg-gray-700 border-gray-600 hover:border-purple-400"
              }`}
            >
              <div className="text-3xl mb-2">{interest.icon}</div>

              <h3 className="font-semibold">{interest.name}</h3>
            </div>
          ))}

        </div>

        {/* Continue Button */}

        <button
          onClick={handleContinue}
          className="mt-8 w-full py-3 bg-purple-500 hover:bg-purple-400 rounded-xl font-bold transition"
        >
          Continue to Dashboard →
        </button>

      </div>

    </div>
  );
}