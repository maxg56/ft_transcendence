import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Cookies from 'js-cookie';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const token = Cookies.get('token')
    const isAuthenticated = token !== undefined;
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
