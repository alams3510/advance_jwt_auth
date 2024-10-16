const { jsonPlaceHolder } = require("../controller/homePageController");
const { userAuthMiddleware } = require("../middleware/userAuthMiddleware");

const router = require("express").Router();
router.get("/json_placeholder", jsonPlaceHolder);

module.exports = router;
