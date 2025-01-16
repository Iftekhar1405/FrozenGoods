import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading state or spinner while checking authentication
    if (isLoading) {
        return <div>Loading...</div>; // You can replace this with a proper loading spinner
    }

    if (!isAuthenticated && location.pathname !== '/') {
        // Only redirect to auth if not on home page
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};