'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Load } from '@/types/dispatch';

interface UseDispatchRealtimeOptions {
  orgId: string;
  pollingInterval?: number; // in milliseconds, default 30 seconds
  enableSSE?: boolean; // Enable Server-Sent Events
}

interface DispatchUpdate {
  type:
    | 'load_update'
    | 'status_change'
    | 'assignment_change'
    | 'new_load'
    | 'load_deleted'
    | 'connected'
    | 'error';
  data?: {
    loadId: string;
    load?: Partial<Load>;
    oldStatus?: string;
    newStatus?: string;
    timestamp: string;
  };
  timestamp?: string;
  message?: string;
}

interface UseDispatchRealtimeReturn {
  isConnected: boolean;
  lastUpdate: Date | null;
  updateCount: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  reconnect: () => void;
}

export function useDispatchRealtime({
  orgId,
  pollingInterval = 30000, // 30 seconds
  enableSSE = true,
}: UseDispatchRealtimeOptions): UseDispatchRealtimeReturn {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');

  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeenLoadTimestamp = useRef<string | null>(null);

  // Handle dispatch updates
  const handleDispatchUpdate = useCallback(
    (update: DispatchUpdate) => {
      // Skip non-actionable updates
      if (update.type === 'connected' || update.type === 'error') {
        return;
      }

      setLastUpdate(new Date());
      setUpdateCount((prev) => prev + 1);

      // Refresh the router to get updated data
      // In a more sophisticated implementation, we could update local state directly
      router.refresh();

      // Optional: Show toast notifications for critical updates
      if (update.type === 'status_change' || update.type === 'assignment_change') {
        // Could trigger toast notifications here
        console.log('Dispatch update:', update);
      }
    },
    [router],
  );

  // Connect to SSE stream
  const connectToSSE = useCallback(() => {
    if (!enableSSE) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus('connecting');

    try {
      const params = new URLSearchParams();
      if (lastSeenLoadTimestamp.current) {
        params.set('since', lastSeenLoadTimestamp.current);
      }

      const eventSource = new EventSource(`/api/dispatch/${orgId}/stream?${params.toString()}`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setConnectionStatus('connected');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const update: DispatchUpdate = JSON.parse(event.data);

          // Handle different message types
          if (update.type === 'connected') {
            console.log('Connected to dispatch stream');
            return;
          }

          if (update.type === 'error') {
            console.error('Dispatch stream error:', update.message);
            return;
          }

          // For actual dispatch updates, extract timestamp and handle update
          if (update.data?.timestamp) {
            lastSeenLoadTimestamp.current = update.data.timestamp;
            handleDispatchUpdate(update);
          } else if (update.timestamp) {
            // Fallback for messages with timestamp at root level
            lastSeenLoadTimestamp.current = update.timestamp;
            handleDispatchUpdate(update);
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = () => {
        setConnectionStatus('disconnected');
        setIsConnected(false);
        eventSource.close();

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect to dispatch stream...');
          connectToSSE();
        }, 5000);
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
    }
  }, [orgId, enableSSE, handleDispatchUpdate]);

  // Polling fallback
  const startPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    const poll = async () => {
      try {
        // Simple polling by checking for updates
        const response = await fetch(
          `/api/dispatch/${orgId}/updates${lastSeenLoadTimestamp.current ? `?since=${lastSeenLoadTimestamp.current}` : ''}`,
          {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
            },
          },
        );

        const data = await response.json().catch(() => null);

        if (response.ok) {
          if (data?.updates && data.updates.length > 0) {
            data.updates.forEach((update: DispatchUpdate) => {
              const timestamp = update.data?.timestamp || update.timestamp;
              if (timestamp) {
                lastSeenLoadTimestamp.current = timestamp;
                handleDispatchUpdate(update);
              }
            });
          }
          setIsConnected(true);
        } else {
          if (data?.error) {
            console.error('Polling error:', data.error);
          }
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
        setIsConnected(false);
      }

      // Schedule next poll
      pollingTimeoutRef.current = setTimeout(poll, pollingInterval);
    };

    // Start polling
    poll();
  }, [orgId, pollingInterval, handleDispatchUpdate]);

  // Reconnect function
  const reconnect = useCallback(() => {
    if (enableSSE) {
      connectToSSE();
    } else {
      startPolling();
    }
  }, [enableSSE, connectToSSE, startPolling]);

  // Initialize connection
  useEffect(() => {
    if (enableSSE) {
      connectToSSE();
    } else {
      startPolling();
      setConnectionStatus('connected');
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enableSSE, connectToSSE, startPolling]);

  return {
    isConnected,
    lastUpdate,
    updateCount,
    connectionStatus,
    reconnect,
  };
}
