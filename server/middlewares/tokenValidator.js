const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  // extracting token from the header
  const token = req.headers.authorization || req.headers.Authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  // if token then split
  const tokenParts = token.split(" ");

  // it the token doesn't have 2 parts and it doesn't start with keyword Bearer respond with error message
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token format" });
  }
  // get the token from the 2nd part
  const accessToken = tokenParts[1];

  try {
    // verify the token using verify function and assign the decoded user to the req.user
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = validateToken;
