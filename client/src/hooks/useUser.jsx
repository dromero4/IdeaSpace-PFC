import { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export function useUser() {
    const cookies = new Cookies();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = cookies.get('access_login_token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded.username);

            } catch (err) {
                console.error("Error decoding the token", err);
                setUser(null);
            }
        }
    }, [])

    return user;
}