const UserModal = require("../model/userModal");
const bcrypt = require("bcrypt");
const { catchAsyncErrors } = require("../utils/catchAsyncError");
const customError = require("../utils/customErrorThrow");
const tokensGenerator = require("../utils/tokensGenerator");
const jwt = require("jsonwebtoken");

exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new customError("User Data Missing", 400));
  }
  let user = await UserModal.findOne({ email });
  if (!user) {
    return next(new customError("User Not Found", 404));
  }
  let savedPassword = user.password;
  const isPasswordMatch = await bcrypt.compare(password, savedPassword);
  if (!isPasswordMatch)
    return next(new customError("Invalid Credentials", 401));
  const accessToken = tokensGenerator.accessToken({
    _id: user._id,
    email: user.email,
  });
  let refreshToken = tokensGenerator.refreshToken({
    _id: user._id,
    email: user.email,
  });
  const maxAgeCookie = parseInt(process.env.COOKIE_MAX_AGE);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, //only use in production for https
    samesite: "None", //save from CSRF attack
    maxAge: maxAgeCookie, //1days
    path: "/",
  });
  res.status(200).json({
    status: true,
    accessToken: accessToken,
    user: { _id: user._id, email: user.email, username: user.username },
    message: "Login Successful",
  });
});

exports.userRegister = catchAsyncErrors(async (req, res, next) => {
  //no need of try and catch any more, handled by centralized error handler
  const { username, email, check } = req.body;
  let { password } = req.body;
  if (!username || !email || !check || !password) {
    return next(new customError("User information incomplete", 400));
  }
  let user = await UserModal.findOne({ email: email });
  if (user) return next(new customError("User Already Exist", 400));
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  //   await UserModal.create({
  //     username,
  //     email,
  //     check,
  //     password,
  //   });

  //   or

  const newUser = new UserModal({
    username,
    email,
    check,
    password,
  });
  await newUser.save();

  res.status(200).json({ success: true, message: "User Created Successfully" });
});

exports.refreshAccesToken = catchAsyncErrors(async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) return next(new customError("Invalid RefreshToken", 401));
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return next(new customError("Expired refresh token", 403));
    const accessToken = tokensGenerator.accessToken({
      _id: user._id,
      email: user.email,
    });
    res.status(200).json({ accessToken });
  });
});
