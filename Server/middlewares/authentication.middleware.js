const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    // Extract the token from the Authorization header, which typically comes in the format "Bearer <token>"
    const token = req.header("Authorization")?.split(" ")[1];  // This extracts the token part after "Bearer"

    if (!token) {
        return res.status(401).json({ "message": "Access Denied, No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded user data to the request object
        next();  // Call the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ "message": "Invalid Token" });
    }
};
