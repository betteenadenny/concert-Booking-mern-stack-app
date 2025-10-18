const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  // const token = req.query.token || req.headers.authorization?.split(" ")[1];
  const token = req.query.token
  if (!token) return res.status(401).send("No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    if (decoded.role !== "admin") return res.status(403).send("Access denied");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
}

module.exports =  authorize ;
