const mongoose = require("mongoose");
exports.mongooseConnect = () => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then((val) => {
      console.log("mongodb connected");
    })
    .catch((error) => {
      console.error("MongoDb connection error", error);
    });
};
