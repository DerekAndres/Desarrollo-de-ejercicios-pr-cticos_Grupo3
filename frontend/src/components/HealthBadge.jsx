import React, { useEffect, useState } from 'react';
import { getHealth } from '../services/api.js';

export default function HealthBadge() {
  const [state, setState] = useState('unknown');

  useEffect(() => {
    let t = null;
    const tick = async () => {
      try {
        const res = await getHealth();
        setState(res.dbState || 'unknown');
      } catch {
        setState('disconnected');
      }
      t = setTimeout(tick, 5000);
    };
    tick();
    return () => t && clearTimeout(t);
  }, []);

  const color = state === 'connected' ? '#16a34a' : state === 'connecting' ? '#f59e0b' : '#dc2626';

  return (
    <span style={{
      display: 'inline-flex', alignItems:'center', gap: '.4rem',
      padding: '.25rem .5rem', borderRadius: '999px',
      background: '#fff', border: `1px solid ${color}`, color
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '999px', background: color }} />
      DB: {state}
    </span>
  );
}
