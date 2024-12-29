const jwt = require("jsonwebtoken");
const getUserRolePermission = require("../routes/api/v1/authentication/authorization_role_permission");

// Middleware function to verify JWT
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  // token = req.headers.authorization.split(" ")[1];

  // Check if the authorization header is present
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No Authorization provided." });
  }

  token = req.headers.authorization.split(" ")[1]; // Get the token from the request header

  if (!token) {
    let value = {
      message: `No token provided`,
      status: 401,
    };
    return res.status(401).json(value);
  }

  // Verify the token with the secret key

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      let value = {
        message: `Failed to authenticate token`,
        status: 401,
      };
      return res.status(401).json(value);
    }

    // If verification is successful, store the decoded token data in the request object
    req.decoded = decoded;
    req.user = decoded;
    let userRoles = await getUserRolePermission.getUserRoles(req.user.USER_ID);
    let userPermission = await getUserRolePermission.getUserPermission(
      req.user.USER_ID
    );
    req.userRoles = userRoles;
    req.userPermission = userPermission;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;
