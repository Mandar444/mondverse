import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: ('user' | 'psychiatrist' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has the correct role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective home dashboard if they try to access unauthorized area
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'psychiatrist') return <Navigate to="/psychiatrist" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
