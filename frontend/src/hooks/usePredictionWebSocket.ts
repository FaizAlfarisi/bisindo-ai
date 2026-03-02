import { useEffect, useRef, useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Change http:// to ws:// for WebSocket protocol
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export const usePredictionWebSocket = () => {
  const ws = useRef<WebSocket | null>(null);
  const [prediction, setPrediction] = useState<{ letter: string; confidence: number } | null>(null);
  const [wsError, setWsError] = useState<string | null>(null);
  const [isWsReady, setIsWsReady] = useState<boolean>(false);
  const reconnectTimeoutRef = useRef<any>(null);
  
  const isPredictingRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setWsError("Not authenticated");
      return;
    }

    if (ws.current) {
      ws.current.close();
    }

    const wsUrl = `${WS_BASE_URL}/ws/predict?token=${token}`;
    console.log("Connecting to WebSocket:", wsUrl);
    
    try {
      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected successfully");
        setWsError(null);
        setIsWsReady(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setPrediction(data);
        isPredictingRef.current = false; 
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsError("AI Server connection failed. Retrying...");
        setIsWsReady(false);
        isPredictingRef.current = false;
      };

      socket.onclose = (event) => {
        console.log("WebSocket disconnected:", event.reason);
        setIsWsReady(false);
        isPredictingRef.current = false;
        
        // Attempt to reconnect after 3 seconds if not a clean close
        if (event.code !== 1000 && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 3000);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setWsError("Could not initialize connection.");
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  const sendLandmarks = useCallback((handsData: { label: string; landmarks: number[][] }[]) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN || isPredictingRef.current) {
      return;
    }

    if (handsData.length === 0) {
      setPrediction((prev) => (prev === null ? null : null)); 
      return;
    }

    isPredictingRef.current = true;
    ws.current.send(JSON.stringify({ hands: handsData }));
  }, []);

  return { prediction, wsError, isWsReady, sendLandmarks, setPrediction };
};
