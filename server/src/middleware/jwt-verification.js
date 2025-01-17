const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'A token is required for authentication' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
    return next();
};

module.exports = verifyToken;
