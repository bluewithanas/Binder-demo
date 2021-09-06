var express = require("express");
const passport = require("passport");
var router = express.Router();

const Maincontroller = require("../controllers/Bindermain.controller");
//@type get
//@route /getusers
//@desc route for getting all registered users, with pagination in descending.
//@access private

router.get(
  "/getusers/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      Maincontroller.getAllUser(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//@type get
//@route /userinfo/:pid
//@desc route for getting user info based on pid sent by client
//@access private

router.get(
  "/userinfo/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      Maincontroller.getUserInfo(req, res);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

//@type get
//@route /connect/:uid/:pid
//@desc route hit when user clicks on connect and insert into matches collection.
//@access private

router.get(
  "/connect/:userid/:partnerid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.connectUser(req, res);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
);

//@type get

//@route /accept/:uid/:pid
//@desc accepts the friend request and set value to true in matches collection
//@access private

router.get(
  "/accept/:uid/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.acceptRequest(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//@type get
//@route /request/:uid
//@desc returns the pending connections whose status is false based on uid
//@access private

router.get(
  "/request/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.getMatchRequest(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//@type get
//@route /connect/:uid
//@desc returns the friend list for the user whose status is true.
//@access private

router.get(
  "/friends/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.getFriendlist(req, res);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
);

//@type delete
//@route /delete/:uid/:pid
//@desc deletes the a friend (pid) of a user (uid).
//@access private

router.delete(
  "/delete/:uid/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.deleteFriend(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//@type delete
//@route /removefriend/:uid/:pid
//@desc deletes the a friend (pid) of a user (uid).
//@access private

router.delete(
  "/removefriend/:uid/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.removeFriend(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

//@type get
//@route /logout/:uid
//@desc handles the logout by unlinking the cache from redis instance
//@access private

router.get(
  "/logout/:uid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Maincontroller.logout(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);



module.exports = router;
