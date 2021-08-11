var express = require("express");
var router = express.Router();
const Authcontroller = require("../controllers/Auth.controller");
const passport = require("passport");

//@type POST
//@route /auth/register
//@desc Registration route for users
//@access public

router.post("/register", async (req, res) => {
  try {
    await Authcontroller.register(req, res);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

//@type get
//@route /auth/test
//@desc test route for auth routes
//@access public

router.get("/test",(req, res) => {
  return res.status(200).json({msg: ' working'})
});

//@type get
//@route /auth/confirmation/:email/:token
//@desc route to verify the account post clicking the link
//@access private

router.get("/confirmation/:email/:token", async (req, res) => {
  try {
    await Authcontroller.mailVerification(req, res);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

//@type post
//@route /auth/login
//@desc route for login
//@access public

router.post("/login", async (req, res) => {
  try {
    await Authcontroller.login(req, res);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ msg: "working" });
  }
);

module.exports = router;
