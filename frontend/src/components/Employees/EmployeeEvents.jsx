// src/components/EmployeeEvent.jsx
import { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function EmployeeEvent({ onNewEmployee }) {
  const { addToast } = useToast(); // ✅ get it from context

  useEffect(() => {
    const origin = API_BASE.replace(/\/api$/, '');
    const sseUrl = `${origin}/api/pubsub/events`;
    const es = new EventSource(sseUrl);

    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === 'employee:new') {
          addToast(`New employee added: ${payload.employee.name}`, 'info');
          onNewEmployee();
        }
      } catch (err) {
        console.warn('SSE parse error:', err);
      }
    };

    es.onerror = (err) => {
      console.warn('SSE error:', err);
      es.close();
    };

    return () => es.close();
  }, [onNewEmployee, addToast]);

  return null; // headless listener
}
