import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateIssueModal from "../components/CreateIssueModal";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";
import AssignUsersModal from "../components/AssignUsersModal";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const { user } = useAuth();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const openAssignModal = (projectId) => {
    setSelectedProjectId(projectId);
    setAssignModalOpen(true);
  };

  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const fetchMyIssues = async () => {
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
    };
    fetchMyIssues();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");
      const projectRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const issueRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/issues/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(projectRes.data);
      setIssues(issueRes.data);
    };
    fetchDetails();
  }, [projectId]);

  const handleCloseIssue = async (id) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/issues/status`,
      { issueId: id, status: "resolved" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIssues((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, status: "resolved", updatedAt: new Date() } : i
      )
    );
  };

  const renderAssignedMembers = () => {
    if (!project.assignedUsers || project.assignedUsers.length === 0) {
      return (
        <p className="text-gray-500">No users assigned to this project.</p>
      );
    }

    return (
      <ul className="list-disc ml-6 text-sm text-gray-700">
        {project.assignedUsers.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email}) - {user.role}
          </li>
        ))}
      </ul>
    );
  };

  const markProjectAsCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/projects/mark-completed/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProject((prev) => ({ ...prev, status: "completed" }));
    } catch (err) {
      console.error("Error marking project as completed:", err);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const openIssues = issues.filter((i) => i.status !== "resolved");
  const closedIssues = issues
    .filter((i) => i.status === "resolved")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <>
      <NavigationBar />

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-800 mb-6 tracking-tight">
          {project.name}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          {project.status !== "completed" ? (
            <button
              onClick={markProjectAsCompleted}
              className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition shadow-sm"
            >
              Mark Project as Completed
            </button>
          ) : (
            <span className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Project Completed
            </span>
          )}

          <button
            onClick={() => setShowMembers((prev) => !prev)}
            className="bg-purple-600 text-white px-5 py-2 rounded-full font-medium hover:bg-purple-700 transition shadow-sm"
          >
            {showMembers ? "Hide Assigned Members" : "Show Assigned Members"}
          </button>
        </div>

        {showMembers && (
          <div className="mb-8 bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-purple-800 mb-2">
              Assigned Members
            </h4>
            {renderAssignedMembers()}
          </div>
        )}

        <p className="text-gray-700 mb-6 text-base">{project.description}</p>

        <img
          src="../../public/images/cooperation.gif"
          alt="placeholder"
          className="w-24 mb-6 rounded-lg"
        />

        {project.status !== "completed" &&
          (user?.role === "admin" ? (
            <button
              onClick={() => openAssignModal(project._id)}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition mb-8 shadow-sm"
            >
              Assign Users
            </button>
          ) : (
            <button
              onClick={() => setShowIssueModal(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition mb-8 shadow-sm"
            >
              Raise Issue
            </button>
          ))}

        {/* Open Issues */}
        <h3 className="text-xl font-semibold text-purple-700 mb-4 tracking-tight">
          Open Issues
        </h3>
        <ul className="space-y-4 mb-10">
          {openIssues.map((i) => (
            <li
              key={i._id}
              className="bg-white p-5 border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg text-blue-800">
                    {i.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Priority: <b>{i.priority}</b> | Created:{" "}
                    {formatDate(i.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleCloseIssue(i._id)}
                  className="text-white bg-green-600 px-4 py-1.5 rounded-full hover:bg-green-700 text-sm transition font-medium shadow-sm"
                >
                  Mark Resolved
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Closed Issues */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
          Resolved Issues
        </h3>
        <ul className="space-y-4">
          {closedIssues.map((i) => (
            <li
              key={i._id}
              className="bg-[#F5F5F5] p-5 border border-gray-200 rounded-2xl shadow-md"
            >
              <h4 className="font-semibold text-lg text-gray-800">{i.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Priority: <b>{i.priority}</b> | Created:{" "}
                {formatDate(i.createdAt)} | Resolved: {formatDate(i.updatedAt)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modals */}
      {showIssueModal && (
        <CreateIssueModal
          project={project}
          onClose={() => {
            setShowIssueModal(false);
            const fetchUpdatedIssues = async () => {
              const token = localStorage.getItem("token");
              const res = await axios.get(
                `${
                  import.meta.env.VITE_API_URL
                }/api/issues/project/${projectId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              setIssues(res.data);
            };
            fetchUpdatedIssues();
          }}
        />
      )}

      <AssignUsersModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        projectId={selectedProjectId}
        refresh={() => {
          const fetchDetails = async () => {
            const token = localStorage.getItem("token");
            const projectRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setProject(projectRes.data);
          };
          fetchDetails();
        }}
      />
    </>
  );
};

export default ProjectDetails;
