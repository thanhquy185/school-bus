import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(import.meta.env.VITE_SERVER_URL);
            setSocket(socketRef.current);
        }
        
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    return socket;
}

export default useSocket;