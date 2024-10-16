const rateLimit = require("express-rate-limit");
exports.rateLimiter = rateLimit({
  windowMs: 5 * 1000, // 5 second
  max: 8, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 1 sec.", // Custom message when rate limit is reached
  // handler: (req, res, next) => {
  //   res.redirect("http://localhost:5173/login");
  // },
});
