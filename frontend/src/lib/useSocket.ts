import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = (events: { [key: string]: (data: any) => void }) => {
  useEffect(() => {
    // Initialize socket if not already done
    if (!socket) {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
      socket = io(baseUrl, {
        withCredentials: true,
      });
      
      socket.on('connect', () => {
        console.log('[Socket] Connected to server', socket?.id);
      });
    }

    // Attach event listeners
    Object.keys(events).forEach(eventName => {
      socket?.on(eventName, events[eventName]);
    });

    return () => {
      // Remove event listeners on cleanup
      Object.keys(events).forEach(eventName => {
        socket?.off(eventName, events[eventName]);
      });
    };
  }, [events]);

  return socket;
};
