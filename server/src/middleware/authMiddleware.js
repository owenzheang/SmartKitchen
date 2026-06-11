import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "smartkitchen-secret-key";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is required." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "JWT token is required." });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

export default authMiddleware;
