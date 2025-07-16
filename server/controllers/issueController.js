const Issue = require("../models/Issue");
const Project = require("../models/Project");

// Create a new issue in a project
const createIssue = async (req, res) => {
  const { title, description, priority, projectId } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const issue = await Issue.create({
      title,
      description,
      priority,
      projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign an issue to a user
const assignIssue = async (req, res) => {
  const { issueId, userId } = req.body;
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.assignedTo = userId;
    await issue.save();

    res.status(200).json({ message: "Issue assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update status of an issue
const updateIssueStatus = async (req, res) => {
  const { issueId, status } = req.body;
  try {
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = status;
    await issue.save();

    res
      .status(200)
      .json({ message: "Status updated", updatedAt: issue.updatedAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all issues for a specific project
const getIssuesByProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const issues = await Issue.find({ projectId }).populate(
      "assignedTo",
      "name email role"
    );
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all issues assigned to a specific user
const getIssuesByUser = async (req, res) => {
  try {
    const issues = await Issue.find({ assignedTo: req.user.id }).populate(
      "projectId",
      "name"
    );
    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createIssue,
  assignIssue,
  updateIssueStatus,
  getIssuesByProject,
  getIssuesByUser,
};
