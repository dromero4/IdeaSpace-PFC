import jwt from 'jsonwebtoken';

export function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token.split(" ")[1], process.env.SESSION_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
    })

    req.user = decoded;
    next();
}