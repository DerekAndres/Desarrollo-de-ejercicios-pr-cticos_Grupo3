import React from 'react';

export default function Layout({ header, children, footer }) {
  return (
    <div className="app-shell">
      <header className="app-header">{header}</header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">{footer || <span>© {new Date().getFullYear()} ActMongo</span>}</footer>
    </div>
  );
}
