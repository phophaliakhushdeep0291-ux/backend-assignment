import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import your custom hook

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // 1. While we are checking the cookie with the backend, show a loader
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner">Verifying Session...</div>
            </div>
        );
    }

    // 2. If not authenticated, redirect to login
    // We save the current location so we can redirect them back after they log in
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If authenticated, render the Dashboard
    return children;
}