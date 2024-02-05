import asyncHandler from "express-async-handler";
import Inventory from "../models/Inventory.model.js";

export const createInventory = asyncHandler(async (req, res, next) => {
  const {user, name, brandName, category, manufacture, price, quantity } = req.body;

  if (!user || !name || !brandName || !category || !manufacture || !price || !quantity) {
    res.status(400).json({ message: "All feilds are required" });
  }

  const duplicate = await Inventory.findOne({ name })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Inventory Name" });
  }
  const inventory = await Inventory.create({
    user,
    name,
    brandName,
    category,
    manufacture,
    price,
    quantity,
  });

  if (inventory) {
    return res.status(201).json({ message: "New Medicine Inventory created" });
  } else {
    return res.status(400).json({ message: "Invalid inventory data received" });
  }
});

export const updateInventory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID Required" });
  }

  const inventory = await Inventory.findById(id).exec();

  if (!inventory) {
    return res.status(400).json({ message: "Medication not found" });
  }

  const { name, brandName, category, manufacture, price, quantity } = req.body;

  if (!name || !brandName || !category || !manufacture || !price || !quantity) {
    res.status(400).json({ message: "All feilds are required" });
  }

  const duplicateInventory = await Inventory.findOne({ name, _id: { $ne: id } })
    .lean()
    .exec();

  if (duplicateInventory) {
    return res.status(409).json({ message: "Duplicate Item Name" });
  }

  inventory.name = name;
  inventory.brandName = brandName;
  inventory.category = category;
  inventory.manufacture = manufacture;
  inventory.price = price;
  inventory.quantity = quantity;

  const updatedInventory = await inventory.save();

  res.json({ message: `${updatedInventory.name} updated` });
});

export const softDeleteInventory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID Required" });
  }

  const inventory = await Inventory.findById(id).exec();

  if (!inventory) {
    return res.status(400).json({ message: "Medicine not found" });
  }

  inventory.deleted = true;
  await inventory.save();

  const reply = `Inventory ${inventory.name} with ID ${inventory._id} deleted`;

  res.json({ success: true, message: reply });
});

export const hardDeleteInventory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID Required" });
  }

  const inventory = await Inventory.findById(id).exec();

  if (!inventory) {
    return res.status(400).json({ message: "Medicine not found" });
  }

  await inventory.deleteOne();

  const reply = `Inventory ${inventory.name} with ID ${inventory._id} deleted`;

  res.json({ success: true, message: reply });
});

export const getAllInventory = asyncHandler(async (req,res,next) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
});

export const searchInventory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Inventory ID Required" });
  }

  try {
    const inventory = await Inventory.findById(id);

     if (!inventory) {
       return res.status(404).json({ message: "Inventory Not Found" });
     }

    res.status(200).json(inventory);
  } catch (error) {
    next(error);
  }
});
