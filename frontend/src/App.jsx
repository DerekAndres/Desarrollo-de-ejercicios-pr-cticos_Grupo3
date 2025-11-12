import React, { useState } from 'react';
import UsuariosList from './components/UsuariosList.jsx';
import PersonasList from './components/PersonasList.jsx';
import HealthBadge from './components/HealthBadge.jsx';
import Layout from './components/Layout.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

export default function App() {
  const [view, setView] = useState('usuarios');

  const header = (
    <div className="header-bar">
      <div className="header-left">
        <h1 className="app-title">ActMongo</h1>
        <HealthBadge />
      </div>
      <div className="header-right">
        <nav className="tabs">
          <button className={view === 'usuarios' ? 'tab active' : 'tab'} onClick={() => setView('usuarios')}>Usuarios</button>
          <button className={view === 'personas' ? 'tab active' : 'tab'} onClick={() => setView('personas')}>Personas</button>
        </nav>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <Layout header={header}>
      {view === 'usuarios' ? <UsuariosList /> : <PersonasList />}
    </Layout>
  );
}
