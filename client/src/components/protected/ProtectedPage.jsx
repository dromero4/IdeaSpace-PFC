import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/modal";

export function ProtectedPage({ children }) {
    const navigate = useNavigate();
    const { isLogged } = useAuth();

    if (!isLogged) {
        setTimeout(() => {
            navigate('/login')
        }, 1000);


        return children;
    }
}