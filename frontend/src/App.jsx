import React, { useState } from 'react';
import UsuariosList from './components/UsuariosList.jsx';
import PersonasList from './components/PersonasList.jsx';
import HealthBadge from './components/HealthBadge.jsx';

export default function App() {
  const [view, setView] = useState('usuarios');

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin:0}}>ActMongo Dashboard</h1>
        <HealthBadge />
      </div>
      <nav className="nav">
        <button className={view === 'usuarios' ? 'active' : ''} onClick={() => setView('usuarios')}>Usuarios</button>
        <button className={view === 'personas' ? 'active' : ''} onClick={() => setView('personas')}>Personas</button>
      </nav>
      <div className="content">
        {view === 'usuarios' ? <UsuariosList /> : <PersonasList />}
      </div>
    </div>
  );
}
