import { useEffect, useRef } from "react";

import { io } from "socket.io-client";


const useSocket = () => {
    const socketClient = useRef<any>(null);

    useEffect(() => {
        if (socketClient.current) return;
        socketClient.current = io(import.meta.env.VITE_SERVER_URL)
    }, []);
    
    return socketClient;
}

export default useSocket;