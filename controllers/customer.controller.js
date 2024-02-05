import asyncHandler from "express-async-handler";
import Customer from "../models/cutomers.model.js";

export const createCustomer = asyncHandler(async (req, res, next) => {

  const { user, name, email, phone, address } = req.body;

  if (!user || !name || !email || !phone || !address) {
    res.status(400).json({ message: "All feilds are required" });
  }

  const duplicate = await Customer.findOne({ email })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  const customer = await Customer.create({ user, name, email, phone, address });

  if (customer) {
    return res.status(201).json({ message: "New customer created" });
  } else {
    return res.status(400).json({ message: "Invalid customer data received" });
  }
});

export const updateCustomer = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Customer ID Required" });
  }

  const customer = await Customer.findById(id).exec();

  if (!customer) {
    return res.status(400).json({ message: "Customer not found" });
  }

  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    res.status(400).json({ message: "All feilds are required" });
  }

  const duplicateEmail = await Customer.findOne({ email, _id: { $ne: id } })
    .lean()
    .exec();

  if (duplicateEmail) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  customer.name = name;
  customer.email = email;
  customer.phone = phone;
  customer.address = address;

  const updatedCustomer = await customer.save();

  res.json({ message: `${updatedCustomer.name} updated` });
});

export const softDeleteCustomer = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Customer ID Required" });
  }

  const customer = await Customer.findById(id).exec();

  if (!customer) {
    return res.status(400).json({ message: "Customer not found" });
  }

  customer.deleted = true;
  await customer.save();

  const reply = `Customer ${customer.name} with ID ${customer._id} deleted`;

  res.json({ success: true, message: reply });
});

export const hardDeleteCustomer = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Customer ID Required" });
  }

  const customer = await Customer.findById(id).exec();

  if (!customer) {
    return res.status(400).json({ message: "Customer not found" });
  }

  await customer.deleteOne();

  const reply = `Customer ${customer.name} with ID ${customer._id} deleted`;

  res.json({ success: true, message: reply });
});

export const getAllCustomer = asyncHandler(async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
});

export const searchCustomer = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Customer ID Required" });
  }

  try {
    const customer = await Customer.findById(id);

    if(!customer){
      return res.status(404).json({ message: "Customer Not Found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
});
