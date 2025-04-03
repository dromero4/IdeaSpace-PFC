import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedPage({ children }) {
    const { isLogged } = useAuth();

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    return children;
}