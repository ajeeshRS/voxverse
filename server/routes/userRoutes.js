const express = require("express");
const { registerUser, userLogin, getUserInfo } = require("../controllers/userController");
const router = express.Router();
const validateToken = require("../middlewares/tokenValidator")

router.post("/signup",registerUser);
router.post('/login',userLogin)
router.get('/get',validateToken,getUserInfo)


module.exports = router;
