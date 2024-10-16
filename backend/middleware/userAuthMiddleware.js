const jwt = require("jsonwebtoken");
const customError = require("../utils/customErrorThrow");

exports.userAuthMiddleware = (req, res, next) => {
  // List of routes you want to exclude from authentication
  const publicRoutes = [
    "/api/user/register",
    "/api/user/login",
    "/api/user/refresh_accessToken",
    "/api/user/logout",
  ];

  // Check if the current route is in the openRoutes list
  if (publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for these routes
  }
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  let accessToken;
  if (authHeader) {
    accessToken = authHeader.split(" ")[1];
  }
  if (!accessToken) return next(new customError("UnAuthorize User", 401));
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(new customError("Expiredddd accessToken", 403));
    req.user = user;
    next();
  });
};
