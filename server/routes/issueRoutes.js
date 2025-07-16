const express = require("express");
const router = express.Router();
const {
  createIssue,
  assignIssue,
  updateIssueStatus,
  getIssuesByProject,
  getIssuesByUser,
} = require("../controllers/issueController");

const { protect } = require("../middleware/authMiddleware");

// Issue routes
router.post("/create", protect, createIssue);
router.put("/assign", protect, assignIssue);
router.put("/status", protect, updateIssueStatus);
router.get("/project/:projectId", protect, getIssuesByProject);
router.get("/my-issues", protect, getIssuesByUser);

module.exports = router;
