import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import customerRoutes from "./routes/customer.routes.js";
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/user", userRoutes); 
app.use("/api/v1/auth", authRoutes); 
app.use("/api/v1/inventory", inventoryRoutes); 
app.use("/api/v1/customer", customerRoutes); 

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Port number
const port = 3500;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    app.listen(
      port,
      console.log(`Server is Listening to port: ${port} & DB Connected!`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
