import React from 'react';
import { Navigate } from 'react-router-dom'; // Si tu utilises react-router
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Rediriger vers login si non authentifié
  }

  return <>{children}</>; // Afficher les enfants si authentifié
};

export default ProtectedRoute;
