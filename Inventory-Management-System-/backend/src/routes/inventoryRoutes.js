const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createInventory,
  getInventory,
  getInventoryItem,
  deleteInventory,
  updateInventory,
} = require("../controllers/inventoryController");

// Use simple wrapper to handle async errors automatically
const asyncHandler = require("express-async-handler");

// All routes here are protected by the auth middleware
router.use(protect);

// Route: /api/inventory
router.route("/")
  .get(asyncHandler(getInventory))
  .post(asyncHandler(createInventory));

// Route: /api/inventory/:id
router.route("/:id")
  .get(asyncHandler(getInventoryItem))
  .delete(asyncHandler(deleteInventory))
  .put(asyncHandler(updateInventory));

module.exports = router;