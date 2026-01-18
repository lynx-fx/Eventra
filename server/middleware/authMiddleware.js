const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET || process.env.JWT_SECRET);
            req.user = decoded;
            // Note: original controller used tokenExtractor which decodes manually or similar. 
            // But here we set req.user. The controllers I wrote use tokenExtractor(req) to get ID, 
            // which might re-decode or just extract from header.
            // Let's ensure consistency.
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
