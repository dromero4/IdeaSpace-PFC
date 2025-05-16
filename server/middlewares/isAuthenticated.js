import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ error: "No token provided" });

    const tokenWithoutBearer = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) return false; // el token no es válido, no se puede continuar

        req.user = decoded;
        next(); // solo continúa si el token es válido
    });
}
