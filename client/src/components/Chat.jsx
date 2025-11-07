import { useState, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { socket, onlineUsers } = useSocket();
    const messagesEndRef = useRef(null);
    
    const userData = localStorage.getItem("user");
    const currentUser = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (message) => {
            if (selectedUser && (message.senderId === selectedUser._id || message.receiverId === selectedUser._id)) {
                setMessages((prev) => [...prev, message]);
            }
            
            // Move user to top of list
            setUsers((prevUsers) => {
                const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
                const userIndex = prevUsers.findIndex(u => u._id === otherUserId);
                if (userIndex > 0) {
                    const user = prevUsers[userIndex];
                    return [user, ...prevUsers.filter((_, i) => i !== userIndex)];
                }
                return prevUsers;
            });
        });

        return () => socket.off("newMessage");
    }, [socket, selectedUser, currentUser]);

    const API_BASE = import.meta.env.PROD ? "https://auth-t07c.onrender.com/api" : "http://localhost:4000/api";

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE}/messages/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE}/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_BASE}/messages/send`, {
                receiverId: selectedUser._id,
                text: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessages((prev) => [...prev, response.data]);
            setNewMessage("");
            
            // Move selected user to top
            setUsers((prevUsers) => {
                const userIndex = prevUsers.findIndex(u => u._id === selectedUser._id);
                if (userIndex > 0) {
                    const user = prevUsers[userIndex];
                    return [user, ...prevUsers.filter((_, i) => i !== userIndex)];
                }
                return prevUsers;
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const selectUser = (user) => {
        setSelectedUser(user);
        fetchMessages(user._id);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Chats</h2>
                </div>
                <div className="overflow-y-auto">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => selectUser(user)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                selectedUser?._id === user._id ? "bg-blue-50" : ""
                            }`}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    {onlineUsers.includes(user._id) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {selectedUser.username[0].toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="font-medium">{selectedUser.username}</p>
                                    <p className="text-sm text-gray-500">
                                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`flex ${
                                        message.senderId === currentUser.id ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.senderId === currentUser.id
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        <p>{message.text}</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-4 border-t bg-white">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;