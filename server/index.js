import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./database/database.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "https://localhost:3000"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

//Routes
app.use("/api", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
