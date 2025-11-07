import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import { getReceiverSocketId, io } from "../config/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, image } = req.body;
        const senderId = req.user.id;

        const message = new Message({
            senderId,
            receiverId,
            text,
            image
        });

        await message.save();
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }
        
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await User.find({ _id: { $ne: currentUserId } }).select("username email");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};