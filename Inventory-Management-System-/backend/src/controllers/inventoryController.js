const Inventory = require("../models/Inventory");

// @desc    Create new inventory item
// @route   POST /api/inventory
const createInventory = async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation (description is optional)
  if (!name || !sku || !category || quantity === undefined || !price) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  // Create new product
  const inventory = await Inventory.create({
    user: req.user.id, // This links the item to the logged-in user
    name,
    sku,
    category,
    quantity,
    price,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Item created successfully",
    data: inventory
  });
};

// @desc    Get all inventory items
// @route   GET /api/inventory
const getInventory = async (req, res) => {
  // Only find items that belong to the current user
  const inventory = await Inventory.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: inventory.length,
    data: inventory
  });
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
const getInventoryItem = async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  // 1. Check if item exists
  if (!inventory) {
    res.status(404);
    throw new Error("Item not found");
  }

  // 2. Check if user owns the item
  if (inventory.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json({
    success: true,
    data: inventory
  });
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
const deleteInventory = async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  // 1. Check if item exists
  if (!inventory) {
    res.status(404);
    throw new Error("Item not found");
  }

  // 2. Check if user owns the item
  if (inventory.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await inventory.deleteOne();
  res.status(200).json({ success: true, message: "Item deleted successfully" });
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
const updateInventory = async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;
  const inventory = await Inventory.findById(req.params.id);

  // 1. Check if item exists
  if (!inventory) {
    res.status(404);
    throw new Error("Item not found");
  }

  // 2. Check if user owns the item
  if (inventory.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // 3. Update Item
  const updatedInventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    {
      name,
      sku,
      category,
      quantity,
      price,
      description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Item updated successfully",
    data: updatedInventory
  });
};

module.exports = {
  createInventory,
  getInventory,
  getInventoryItem,
  deleteInventory,
  updateInventory,
};