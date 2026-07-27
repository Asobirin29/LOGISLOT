import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const useRealtimeBookings = <T extends { id: number; status: string }>(
  initialBookings: T[],
  onNeedRefetch?: () => void
) => {
  const [bookings, setBookings] = useState<T[]>(initialBookings);

  // Sync initial bookings if they change (e.g., from an API refetch)
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useEffect(() => {
    if (!socket) {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '');
      
      // We must retrieve the JWT token from cookies/localstorage (depending on how frontend stores it)
      // Since it's stored in cookies as httpOnly for refresh, access token might be in memory.
      // Wait, we need to pass access_token to the socket.
      // Assuming access_token is in localStorage (or accessible via an API call).
      // If we don't have it directly, we might need a workaround or assume it's in localStorage for now.
      const getAccessToken = () => {
        // Quick fallback: read from localStorage if it's there, otherwise this might fail the handshake.
        return localStorage.getItem('access_token') || '';
      };

      socket = io(baseUrl, {
        withCredentials: true,
        auth: {
          token: getAccessToken()
        }
      });
    }

    const onBookingChanged = (payload: any) => {
      console.log('[Socket] booking:status_changed', payload);
      setBookings(prev => {
        // Check if booking exists
        const exists = prev.find(b => b.id === payload.booking_id);
        
        if (exists) {
          // Update status
          return prev.map(b => 
            b.id === payload.booking_id 
              ? { ...b, status: payload.status_baru, loading_dock_id: payload.loading_dock_id, _isNewUpdate: true } 
              : { ...b, _isNewUpdate: false }
          );
        } else {
          // If we want to add new bookings dynamically, we might not have all data fields (supplier name, etc).
          // We trigger a refetch for the consumer.
          if (onNeedRefetch) {
            onNeedRefetch();
          }
          return prev;
        }
      });
    };

    socket.on('booking:status_changed', onBookingChanged);

    return () => {
      socket?.off('booking:status_changed', onBookingChanged);
    };
  }, []);

  return { bookings, setBookings, socket };
};
