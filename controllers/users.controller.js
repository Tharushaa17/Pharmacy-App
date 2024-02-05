import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

export const getAllUsers = asyncHandler(async (req, res, next) => {

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const { username, email, roles, active, password } = req.body;

  if (!username || !email || !roles.length || !active || !password) {
    res.status(400).json({ message: "All feilds are required" });
  }

  const duplicateUsername = await User.findOne({ username, _id: { $ne: id } })
    .lean()
    .exec();
    
  const duplicateEmail = await User.findOne({ email, _id: { $ne: id } })
    .lean()
    .exec();

  if (duplicateUsername) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  if (duplicateEmail) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  user.email = email;
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

export const deleteUser = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  await user.deleteOne();

  const reply = `Username ${user.username} with ID ${user._id} deleted`;

  res.json({ success: true, message: reply });
});

export const searchUser = asyncHandler(async (req, res, next) => {

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  try {
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});
