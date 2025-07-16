const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project (admin only)
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      status: "in-progress", // ✅ explicitly set project status
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign users to a project
const assignUsersToProject = async (req, res) => {
  const { projectId } = req.params;
  const { userIds } = req.body;

  try {
    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Add users to project
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { assignedUsers: { $each: userIds } },
    });

    res.json({ message: "Users assigned successfully" });
  } catch (err) {
    console.error("Error assigning users to project:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all projects created by the admin
const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id }).populate(
      "assignedUsers",
      "name email role"
    );
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get project details with assigned users
const getProjectDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedUsers", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAvailableUsers = async (req, res) => {
  try {
    // Get all users who are not currently assigned to any project
    const users = await User.find({
      role: { $in: ["developer", "tester"] },
      $or: [
        { assignedProjects: { $exists: false } },
        { assignedProjects: { $size: 0 } },
      ],
    }).select("name email role");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch available users" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().select(
      "name description status assignedUsers"
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const markProjectAsCompleted = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.status = "completed";
    await project.save();

    res.status(200).json({ message: "Project marked as completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProject,
  assignUsersToProject,
  markProjectAsCompleted,
  getAdminProjects,
  getProjectDetails,
  getAvailableUsers,
  getAllProjects,
};
