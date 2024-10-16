exports.centralizeErrorHandler = (err, req, res, next) => {
  //log the error for debugging, stack gives path to the error, helpful while development
  // console.log("stack central error>>>>>>>>>>>>>>", err.stack);

  //set default statuscode and mesage

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle specific error types if needed
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid Data Input";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path} : ${err.value}`;
  } else if (err.statusCode === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
