import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ProjectModal from "../components/ProjectModal";
import AssignUsersModal from "../components/AssignUsersModal";
import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProjectId] = useState(null);
  const navigate = useNavigate();

  // const openAssignModal = (projectId) => {
  //   setSelectedProjectId(projectId);
  //   setAssignModalOpen(true);
  // };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/my-projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // only if your backend needs it (e.g. cookies/session)
        }
      );

      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const inProgressProjects = projects.filter((p) => p.status !== "completed");
  const completedProjects = projects.filter((p) => p.status === "completed");

  return (
    <>
      <NavigationBar
        isAdmin={true}
        onCreateProjectClick={() => setOpen(true)}
      />

      <div className="p-6 max-w-6xl mx-auto">
        {/* In-Progress Projects */}
        <section className="mb-12">
          <div className="flex items-center mb-4 gap-3">
            <img
              src="images/checklist.gif"
              alt="Project Icon"
              className="h-8 w-8 object-contain"
            />
            <h3 className="text-2xl font-semibold text-blue-800 tracking-tight">
              In-Progress Projects
            </h3>
          </div>

          {inProgressProjects.length === 0 ? (
            <p className="text-gray-500 italic">No in-progress projects.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgressProjects.map((project) => (
                <li
                  key={project._id}
                  className="rounded-2xl p-5 shadow-md bg-white border border-blue-100 transition hover:shadow-lg"
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-3">
                    {project.name}
                  </h4>
                  <button
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                  >
                    View Project
                    <img
                      src="../../public/images/menu-dots.png"
                      alt="Arrow"
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Completed Projects */}
        <section className="mb-12">
          <div className="flex items-center mb-4 gap-3">
            <img
              src="/images/like.gif"
              alt="Project Icon"
              className="h-8 w-8 object-contain"
            />
            <h3 className="text-2xl font-semibold text-green-800 tracking-tight">
              Completed Projects
            </h3>
          </div>
          {completedProjects.length === 0 ? (
            <p className="text-gray-500 italic">No completed projects yet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedProjects.map((project) => (
                <li
                  key={project._id}
                  className="rounded-2xl p-5 shadow-md bg-[#F0FDF4] border border-green-200 transition hover:shadow-lg"
                >
                  <h4 className="text-xl font-semibold text-green-700 mb-3">
                    {project.name}
                  </h4>
                  <button
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition shadow-sm flex items-center gap-2"
                  >
                    View Project
                    <img
                      src="../../public/images/menu-dots.png"
                      alt="Arrow"
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ProjectModal
          open={open}
          onClose={() => setOpen(false)}
          refresh={fetchProjects}
        />

        <AssignUsersModal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          projectId={selectedProjectId}
          refresh={fetchProjects}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
