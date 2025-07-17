import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CreateIssueModal from "../components/CreateIssueModal";
import NavigationBar from "../components/NavigationBar";
import { useAuth } from "../context/AuthContext";
import { PieChart } from "@mui/x-charts/PieChart";
import AssignUsersModal from "../components/AssignUsersModal";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const { user } = useAuth();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [trendData, setTrendData] = useState({
    labels: [],
    createdCounts: [],
    resolvedCounts: [],
  });
  const [priorityData, setPriorityData] = useState({
    labels: [],
    values: [],
  });

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

      const roleCounts = {};
      projectRes.data.assignedUsers?.forEach((user) => {
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
      });
      setRoleData(
        Object.entries(roleCounts).map(([role, count], i) => ({
          id: i,
          value: count,
          label: role,
        }))
      );

      setIssues(issueRes.data);

      // Utility function to format date as YYYY-MM-DD
      const formatDateKey = (dateStr) =>
        new Date(dateStr).toLocaleDateString("en-CA"); // Gives YYYY-MM-DD format in local time

      const trendMap = {};

      issueRes.data.forEach((issue) => {
        const createdDate = formatDateKey(issue.createdAt);
        trendMap[createdDate] = trendMap[createdDate] || {
          created: 0,
          resolved: 0,
        };
        trendMap[createdDate].created += 1;

        if (issue.status === "resolved") {
          const resolvedDate = formatDateKey(issue.updatedAt);
          trendMap[resolvedDate] = trendMap[resolvedDate] || {
            created: 0,
            resolved: 0,
          };
          trendMap[resolvedDate].resolved += 1;
        }
      });

      const sortedDates = Object.keys(trendMap).sort();
      const createdCounts = sortedDates.map(
        (date) => trendMap[date].created || 0
      );
      const resolvedCounts = sortedDates.map(
        (date) => trendMap[date].resolved || 0
      );

      setTrendData({
        labels: sortedDates,
        createdCounts,
        resolvedCounts,
      });

      const priorityMap = { high: 0, medium: 0, low: 0 };

      issueRes.data.forEach((issue) => {
        if (priorityMap.hasOwnProperty(issue.priority)) {
          priorityMap[issue.priority]++;
        }
      });

      const labels = Object.keys(priorityMap);
      const values = Object.values(priorityMap);
      setPriorityData({ labels, values });
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

        <div className="mb-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-6 tracking-tight">
            Dashboard Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            {/* LEFT COLUMN - Line Chart */}
            {trendData.labels.length > 0 && (
              <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm h-[49  0px] flex items-center justify-center">
                <div className="w-full overflow-x-auto">
                  <h4 className="text-md font-medium text-gray-800 mb-2 text-center">
                    Issue Trends Over Time
                  </h4>
                  <LineChart
                    width={350}
                    height={400}
                    series={[
                      {
                        data: trendData.createdCounts,
                        label: "Created",
                        color: "#1976d2",
                      },
                      {
                        data: trendData.resolvedCounts,
                        label: "Resolved",
                        color: "#2e7d32",
                      },
                    ]}
                    xAxis={[{ scaleType: "band", data: trendData.labels }]}
                  />
                </div>
              </div>
            )}

            {/* RIGHT COLUMN - Stacked Charts */}
            <div className="flex flex-col gap-4">
              {/* Issue Summary */}
              <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-sm md:w-[350px] lg:h-[150px]">
                <h4 className="text-sm font-medium text-gray-800 text-center mb-2">
                  Issue Summary
                </h4>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: openIssues.length, label: "Open" },
                        {
                          id: 1,
                          value: closedIssues.length,
                          label: "Resolved",
                        },
                      ],
                    },
                  ]}
                  width={100}
                  height={100}
                />
              </div>

              {/* Role Distribution */}
              {roleData.length > 0 && (
                <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-sm md:w-[350px] lg:h-[150px]">
                  <h4 className="text-sm font-medium text-gray-800 text-center mb-2">
                    User Role Distribution
                  </h4>
                  <PieChart
                    series={[
                      {
                        data: roleData,
                        innerRadius: 30,
                      },
                    ]}
                    width={100}
                    height={100}
                  />
                </div>
              )}

              {/* Priority Bar Chart */}
              {priorityData.labels.length > 0 && (
                <div className="bg-white p-2 border border-gray-200 rounded-xl shadow-sm md:w-[350px] lg:h-[150px]">
                  <h4 className="text-sm font-medium text-gray-800 text-center mb-2">
                    Issues by Priority
                  </h4>
                  <BarChart
                    width={200}
                    height={120}
                    xAxis={[{ scaleType: "band", data: priorityData.labels }]}
                    series={[{ data: priorityData.values, color: "#1e88e5" }]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <img
          src="../../public/images/cooperation.gif"
          alt="placeholder"
          className="w-24 mb-6 rounded-lg"
        /> */}

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
        {openIssues.length === 0 ? (
          <p className="text-gray-500 mb-10">No open issues.</p>
        ) : (
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
        )}

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
