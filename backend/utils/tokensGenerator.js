const jwt = require("jsonwebtoken");

exports.accessToken = ({ _id, email }) => {
  const accessToken = jwt.sign(
    { userId: _id, email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

exports.refreshToken = ({ _id, email }) => {
  const refreshToken = jwt.sign(
    { userId: _id, email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};
