import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./UserProfile.css";

const UserProfile: React.FC = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth() - 9, 1); // Start date 10 months ago
  const endDate = today;

  // Dummy submission data for the last ten months
  const submissionData = Array.from({ length: 300 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 9, i + 1);
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 5),
    };
  });

  // Track solved problems by difficulty level
  const [solvedProblems, setSolvedProblems] = useState({
    easy: 10,
    medium: 5,
    hard: 3,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Profile Card */}
      <div className="md:w-1/3 min-h-full">
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-md mx-4 my-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Fazal</h2>
          <p className="text-gray-500 mb-4">Software Engineer</p>
          <p className="text-gray-700 mb-6 text-center">
            Passionate about coding and problem solving.
          </p>
          <div className="flex space-x-4 mb-6">
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-gray-600 hover:text-gray-800 transition-colors duration-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-gray-600 hover:text-gray-800 transition-colors duration-300" />
            </a>
            <a
              href="https://twitter.com/username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-gray-600 hover:text-gray-800 transition-colors duration-300" />
            </a>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Solved Problems and Calendar Heatmap */}
      <div className="md:w-2/3 flex flex-col mx-4 my-4">
        <div className="flex flex-col md:flex-row mb-4">
          {/* Solved Problems Card */}
          <div className="flex-1 md:mr-2">
            <div className="p-6 bg-white shadow-md rounded-md mb-4">
              <h3 className="text-xl font-semibold mb-4">
                Solved Problems by Difficulty
              </h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="w-20 text-gray-600">Easy:</span>
                  <div className="flex-1 h-4 bg-green-200 rounded-full">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${(solvedProblems.easy / 20) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{solvedProblems.easy}/20</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-600">Medium:</span>
                  <div className="flex-1 h-4 bg-yellow-200 rounded-full">
                    <div
                      className="h-full rounded-full bg-yellow-500"
                      style={{
                        width: `${(solvedProblems.medium / 15) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-2">{solvedProblems.medium}/15</span>
                </div>
                <div className="flex items-center">
                  <span className="w-20 text-gray-600">Hard:</span>
                  <div className="flex-1 h-4 bg-red-200 rounded-full">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${(solvedProblems.hard / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{solvedProblems.hard}/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Activity Card */}
          <div className="flex-1 md:ml-2">
            <div className="p-6 bg-white shadow-md rounded-md mb-4">
              <h3 className="text-xl font-semibold mb-4">
                Submission Activity
              </h3>
              {/* First Row of Submission Activity */}
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <div className="text-gray-600">Submissions Today:</div>
                  <div className="font-bold">3</div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="text-gray-600">Total Submissions:</div>
                  <div className="font-bold">150</div>
                </div>
              </div>
              {/* Second Row of Submission Activity */}
              <div className="flex">
                <div className="w-1/2 pr-2">
                  <div className="text-gray-600">Average Submissions:</div>
                  <div className="font-bold">5 per day</div>
                </div>
                <div className="w-1/2 pl-2">
                  <div className="text-gray-600">Best Streak:</div>
                  <div className="font-bold">12 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Heatmap Card */}
        <div className="p-6 bg-white shadow-md rounded-md">
          <h3 className="text-xl font-semibold mb-4">Calendar Heatmap</h3>
          <div className="calendar-heatmap-wrapper">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={submissionData}
              classForValue={(value) => {
                if (!value) {
                  return "color-empty";
                }
                return `color-scale-${value.count}`;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
