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

  if (loading) return <p className="status">Cargando personas...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div>
      <h2>Personas</h2>
      {data.length === 0 && <p>No hay personas.</p>}
      <table>
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
  );
}
