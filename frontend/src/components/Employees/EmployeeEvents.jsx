import { useEffect, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function EmployeeEvent({ onNewEmployee }) {
  const { addToast } = useToast();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const connectSSE = () => {
      try {
        const sseUrl = 'https://redis-m04j.onrender.com/api/pubsub/events';
        
        console.log('Connecting to SSE:', sseUrl);
        
        const es = new EventSource(sseUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          console.log('SSE connection opened');
        };

        es.onmessage = (ev) => {
          console.log('SSE message received:', ev.data);
          try {
            const payload = JSON.parse(ev.data);
            
            if (payload.type === 'employee:new') {
              addToast(`New employee added: ${payload.employee.name}`, 'info');
              if (onNewEmployee) {
                onNewEmployee();
              }
            } else if (payload.type === 'connected') {
              console.log('SSE connected successfully');
            }
          } catch (err) {
            console.warn('SSE parse error:', err);
          }
        };

        es.onerror = (err) => {
          console.error('SSE error:', err);
          es.close();
          
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (eventSourceRef.current === es) {
              console.log('Attempting to reconnect SSE...');
              connectSSE();
            }
          }, 5000);
        };
      } catch (err) {
        console.error('Failed to create EventSource:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [onNewEmployee, addToast]);

  return null; // headless listener
}