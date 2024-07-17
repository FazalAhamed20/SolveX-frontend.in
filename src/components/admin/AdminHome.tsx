  import React, { useState, useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { Logout } from "../../redux/actions/AuthActions";
  import { useNavigate } from "react-router-dom";
  import { AppDispatch } from "../../redux/Store";
  import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } from "recharts";
  import { AuthAxios } from "../../config/AxiosInstance";
  import UserTable from "./UserTable";
import LogoutModal from "../../utils/modal/LogoutModal";

  const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [problems, setProblemData] = useState<any[]>([]);
    const [activeSection, setActiveSection] = useState("problems");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      fetchUserData();
      fetchProblemData();
    }, []);

    const fetchUserData = async () => {
      try {
        const response = await AuthAxios.get("/user");

        const data = response.data.data;

        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProblemData = async () => {
      try {
        const response = await fetch("/api/problems");
        const data = await response.json();
        setProblemData(data);
      } catch (error) {
        console.error("Error fetching problem data:", error);
      }
    };

    const handleLogout = async () => {
      await dispatch(Logout());
      navigate("/login", { replace: true });
    };

    const handleSectionChange = (section: string) => {
      setActiveSection(section);
    };

    const problemDifficultyData = [
      { name: "Easy", value: 40 },
      { name: "Medium", value: 30 },
      { name: "Hard", value: 20 },
      { name: "Expert", value: 10 },
    ];

    const userData = [
      { name: "Jan", problems: 10, submissions: 50 },
      { name: "Feb", problems: 15, submissions: 60 },
      { name: "Mar", problems: 20, submissions: 70 },
      { name: "Apr", problems: 25, submissions: 80 },
      { name: "May", problems: 30, submissions: 90 },
      { name: "Jun", problems: 35, submissions: 100 },
    ];

    return (
      <div className="admin-dashboard flex h-screen">
        <nav className="bg-gray-800 text-white p-6 hidden md:block">
          <ul>
            <li
              className={`mb-4 cursor-pointer ${
                activeSection === "dashboard" ? "font-bold" : ""
              }`}
              onClick={() => handleSectionChange("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={`mb-4 cursor-pointer ${
                activeSection === "problems" ? "font-bold" : ""
              }`}
              onClick={() => handleSectionChange("problems")}
            >
              Problems
            </li>

            <li
              className={`mb-4 cursor-pointer ${
                activeSection === "users" ? "font-bold" : ""
              }`}
              onClick={() => handleSectionChange("users")}
            >
              Users
            </li>
            <li
              className={`mb-4 cursor-pointer ${
                activeSection === "leaderboard" ? "font-bold" : ""
              }`}
              onClick={() => handleSectionChange("leaderboard")}
            >
              Leaderboard
            </li>
            <li
              className={`mb-4 cursor-pointer ${
                activeSection === "subscription" ? "font-bold" : ""
              }`}
              onClick={() => handleSectionChange("subscription")}
            >
              Subscription
            </li>
          </ul>
        </nav>

        <div className="flex-1 bg-gray-100 p-6">
          <header className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={()=>{setShowModal(true)}}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </header>

          {activeSection === "dashboard" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Problems</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Problem Difficulty</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={problemDifficultyData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {problemDifficultyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-4">User Activity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="problems" fill="#8884d8" />
                      <Bar dataKey="submissions" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeSection === "users" && <UserTable users={users} />}

          {activeSection === "leaderboard" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
              {/* Leaderboard data */}
            </div>
          )}

          {activeSection === "subscription" && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Subscription</h2>
              {/* Subscription data */}
            </div>
          )}
        </div>
        <LogoutModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onLogout={handleLogout}
                data={"Logout"}
            />
      </div>
    );
  };

  export default AdminDashboard;

  

 
