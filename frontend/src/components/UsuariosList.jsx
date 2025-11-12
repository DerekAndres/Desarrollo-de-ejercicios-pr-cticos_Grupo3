import React, { useEffect, useState } from 'react';
import { getUsuarios } from '../services/api.js';

export default function UsuariosList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        const usuarios = await getUsuarios();
        if (!cancelled) {
          setData(usuarios);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error cargando usuarios');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="status">Cargando usuarios...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div>
      <h2>Usuarios</h2>
      {data.length === 0 && <p>No hay usuarios.</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {data.map(u => (
            <tr key={u._id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>{String(u.activo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
