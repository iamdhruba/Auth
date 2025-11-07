import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { SocketContextProvider } from "./context/SocketContext";

const App = () => {
  return (
    <BrowserRouter>
      <SocketContextProvider>
        <AppRoutes />
      </SocketContextProvider>
    </BrowserRouter>
  );
};

export default App;
