const axios = require("axios");
const { catchAsyncErrors } = require("../utils/catchAsyncError");
const customError = require("../utils/customErrorThrow");

exports.jsonPlaceHolder = catchAsyncErrors(async (req, res, next) => {
  const result = await axios.get("https://jsonplaceholder.typicode.com/posts/");
  if (!result)
    return next(new customError("error while fetching jsonpalceholder", 400));
  return res.status(200).json(result.data);
});
