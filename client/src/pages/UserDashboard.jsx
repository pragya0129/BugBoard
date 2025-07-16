import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

const UserDashboard = () => {
  const { user } = useAuth();
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [setIssues] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const fetchMyIssues = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/issues/my-issues`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues", err);
    }
  };

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const allProjects = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(allProjects.data[0].assignedUsers);
        const userId = user.id?.toString().trim();
        console.log("typeof user._id:", typeof user._id); // Should be 'string'
        console.log("user._id:", JSON.stringify(user._id));

        const assigned = allProjects.data.filter((project) => {
          return (
            Array.isArray(project.assignedUsers) &&
            project.assignedUsers.includes(userId)
          );
        });

        console.log(assigned);

        const active = assigned.filter((p) => p.status !== "completed");
        const completed = assigned.filter((p) => p.status === "completed");

        setAssignedProjects(active);
        setCompletedProjects(completed);
      } catch (err) {
        console.error("Error fetching assigned projects", err);
      }
    };

    fetchAssignedProjects();
  }, [user.id]);

  return (
    <>
      <NavigationBar isAdmin={false} />
      <div className="p-6 max-w-5xl mx-auto">
        {/* Assigned Projects */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-blue-800 tracking-tight">
            Your Projects
          </h3>
          {assignedProjects.length === 0 ? (
            <p className="text-gray-500 italic">No projects assigned.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedProjects.map((p) => (
                <li
                  key={p._id}
                  className="cursor-pointer border border-blue-100 bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition"
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  <div className="mb-3">
                    <h4 className="text-lg font-semibold text-blue-700">
                      {p.name}
                    </h4>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Raise Issue Modal (optional) */}
        {selectedProject && (
          <CreateIssueModal
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              fetchMyIssues();
            }}
          />
        )}

        {/* Completed Projects */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-green-800 tracking-tight">
            Completed Projects
          </h3>
          {completedProjects.length === 0 ? (
            <p className="text-gray-500 italic">No completed projects yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((p) => (
                <li
                  key={p._id}
                  className="cursor-pointer border border-green-200 bg-[#F0FDF4] rounded-2xl shadow-md hover:shadow-lg p-5 transition"
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  <h4 className="text-lg font-semibold text-green-700">
                    {p.name}
                  </h4>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default UserDashboard;
