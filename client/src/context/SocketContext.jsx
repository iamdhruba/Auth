import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const currentUser = userData ? JSON.parse(userData) : null;
        setUser(currentUser);
    }, []);

    useEffect(() => {
        if (user) {
            const socketConnection = io("http://localhost:4000", {
                query: {
                    userId: user.id,
                },
            });

            setSocket(socketConnection);

            socketConnection.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketConnection.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    const connectSocket = () => {
        const userData = localStorage.getItem("user");
        const currentUser = userData ? JSON.parse(userData) : null;
        setUser(currentUser);
    };

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, connectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};