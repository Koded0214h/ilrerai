import { useEffect, useState } from 'react';

export const useRealtime = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const eventSource = new EventSource('/api/events');
    
    eventSource.onopen = () => setConnected(true);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'patient-updated') {
        window.dispatchEvent(new CustomEvent('patient-updated', { detail: data.data }));
      }
    };
    eventSource.onerror = () => setConnected(false);

    return () => eventSource.close();
  }, []);

  return { connected };
};