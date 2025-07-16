const express = require("express");
const router = express.Router();
const {
  createProject,
  assignUsersToProject,
  getAdminProjects,
  getAvailableUsers,
  markProjectAsCompleted,
  getAllProjects,
  getProjectDetails,
} = require("../controllers/projectController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Only admin can create and assign
router.post("/create", protect, authorizeRoles("admin"), createProject);
router.put("/assign", protect, authorizeRoles("admin"), assignUsersToProject);
router.get("/all", protect, getAllProjects); // optionally restrict to admin
router.put("/mark-completed/:id", protect, markProjectAsCompleted);

// Admin dashboard routes
router.get("/my-projects", protect, authorizeRoles("admin"), getAdminProjects);
router.get(
  "/available-users",
  protect,
  authorizeRoles("admin"),
  getAvailableUsers
);
router.put(
  "/assign-users/:projectId",
  protect,
  authorizeRoles("admin"),
  assignUsersToProject
);

// Project detail view for all roles
router.get("/:id", protect, getProjectDetails);

module.exports = router;
