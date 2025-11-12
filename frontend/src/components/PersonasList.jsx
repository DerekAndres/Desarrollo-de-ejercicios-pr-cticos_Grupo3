import React, { useEffect, useState } from 'react';
import { getPersonas } from '../services/api.js';

export default function PersonasList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        const personas = await getPersonas();
        if (!cancelled) {
          setData(personas);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error cargando personas');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <div className="card">
      <div className="card-header"><h2>Personas</h2></div>
      <div className="skeleton-table" aria-hidden>
        {Array.from({length:5}).map((_,i)=>(<div key={i} className="skeleton-row" />))}
      </div>
    </div>
  );
  if (error) return <div className="card"><p className="status error">{error}</p></div>;

  return (
    <div className="card fade-in">
      <div className="card-header"><h2>Personas</h2></div>
      {data.length === 0 && <p>No hay personas.</p>}
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p._id}>
              <td>{p.nombre}</td>
              <td>{p.edad}</td>
              <td>{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
