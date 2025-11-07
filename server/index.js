import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./database/database.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./config/socket.js";

dotenv.config();
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://auth-t07c.onrender.com",
  "https://auth-bice-delta.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
