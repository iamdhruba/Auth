// Test script to create a user for testing
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./model/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        const testUser = new User({
            username: "testuser",
            email: "test@test.com",
            password: hashedPassword
        });

        await testUser.save();
        console.log("Test user created:", testUser);
        
        mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
};

createTestUser();