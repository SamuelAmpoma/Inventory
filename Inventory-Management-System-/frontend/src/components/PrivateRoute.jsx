import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Show loading while checking auth state
    if (loading) {
        return (
            <div className="loader-overlay">
                <div className="loader">
                    <div className="loader-spinner"></div>
                    <span className="loader-text">Loading...</span>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render the protected route
    return <Outlet />;
};

export default PrivateRoute;
