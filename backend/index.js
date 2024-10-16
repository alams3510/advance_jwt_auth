const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userAuth = require("./routes/userAuth");
const homepage = require("./routes/homepage");
const { centralizeErrorHandler } = require("./utils/centralizeErrorHandler");
const { userAuthMiddleware } = require("./middleware/userAuthMiddleware");
const cookieParser = require("cookie-parser");
const { rateLimiter } = require("./middleware/rateLimiter");

const app = express();
const port = process.env.PORT || 8000;
require("./db/dbConnection").mongooseConnect();
app.use(
  cors({
    origin: process.env.REACT_APP_URL, // Allow your frontend domain
    credentials: true, // Allow cookies to be sent
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the allowed methods
    allowedHeaders: "Content-Type, Authorization", // Specify allowed headers
  })
);
app.use(rateLimiter);

app.use(express.json());
app.use(cookieParser());

app.use(userAuthMiddleware);
app.use("/api/user", userAuth);
app.use("/api/home", homepage);
app.get("/", (req, res) => {
  res.send("hello from server");
});
app.use(centralizeErrorHandler);

app.listen(port, () => {
  console.log("Server is started at port : ", port);
});
