// src/components/Layout.tsx
import React from 'react';
import { Navbar } from './Navbar';
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Link to="/profile">Go To profil</Link> {/* Lien vers le Profil */}
      {children} {/* Affiche les enfants ici */}
    </div>
  );
};
