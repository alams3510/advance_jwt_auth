const {
  userLogin,
  userRegister,
  refreshAccesToken,
} = require("../controller/userAuthController");

const router = require("express").Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/refresh_accessToken", refreshAccesToken);

module.exports = router;
