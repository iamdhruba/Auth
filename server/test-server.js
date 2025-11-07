import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/database.js";

dotenv.config();

const app = express();
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Test auth route
app.post("/api/auth/register", (req, res) => {
    res.json({ message: "Register route working", body: req.body });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
    });
});