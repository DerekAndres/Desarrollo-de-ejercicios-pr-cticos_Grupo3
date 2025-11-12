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

  const getColors = () => {
    switch (state) {
      case 'connected': return { bg: '#eef8f0', border: '#88b388', dot: '#88b388' };
      case 'connecting': return { bg: '#fef9ed', border: '#e8c88c', dot: '#e8c88c' };
      default: return { bg: '#fef5f4', border: '#d9988f', dot: '#d9988f' };
    }
  };

  const colors = getColors();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: '#3d3935',
      fontSize: '0.85rem',
      fontWeight: '500',
      letterSpacing: '0.3px',
      transition: 'all 0.3s ease'
    }}>
      <span style={{
        width: 10,
        height: 10,
        borderRadius: '999px',
        background: colors.dot,
        boxShadow: `0 0 0 3px ${colors.bg}`,
        animation: state === 'connecting' ? 'pulse 2s infinite' : 'none'
      }} />
      DB: {state}
    </span>
  );
}
