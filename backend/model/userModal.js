const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Required"],
      minlength: [3, "Minimum 3 character required"],
      maxlength: [20, "Maximum 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required feild"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum 6 length accepted"],
      //   match: [
      //     /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
      //     "Password must contain at least 6 characters, including letters and numbers",
      //   ],
    },
  },
  { timestamps: true }
);

const UserModal = mongoose.model("user", UserSchema);
module.exports = UserModal;
