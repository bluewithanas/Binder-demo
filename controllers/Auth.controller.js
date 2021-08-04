const Authcontroller = {};
const UserModal = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const TokenModal = require("../models/TokenSchema");
const transporter = require("../setup/mailTransporter");
const jsonwt = require("jsonwebtoken");
const { secret } = require("../setup/mongourl");
const passport = require("passport");
const passregex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const emailregex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

Authcontroller.register = async (req, res) => {
  const {
    name = "",
    email = "",
    password = "",
    confirmPassword = "",
  } = req.body || {};

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json("All fields are mandatory to fill!");
  }

  if (!emailregex.test(String(email))) {
    return res.status(400).json("Please enter a valid email");
  }

  if (!passregex.test(String(password))) {
    return res.status(400).json("Please enter a Strong password");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("Passwords doesnt match");
  }

  UserModal.findOne({ email: email })
    .then((user) => {
      if (user) {
        console.log(user);
        return res.status(400).json("Email already registered");
      } else {
        const newUser = new UserModal({
          name: name,
          email: email,
        });

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then(async (person) => {
                TokenModal.find({ userId: person._id })
                  .then((token) => {
                    if (!token.length) {
                      const newTokenModal = new TokenModal({
                        userId: person._id,
                        token: crypto.randomBytes(16).toString("hex"),
                      });

                      newTokenModal
                        .save()
                        .then((response) => {
                          const mailOptions = {
                            from: process.env.EMAIL,
                            to: person.email,
                            subject: "Email Verification",
                            text:
                              "Hello " +
                              person.name +
                              ",\n\n" +
                              "Please verify your account by clicking the link: \nhttp://" +
                              req.headers.host +
                              "/auth/confirmation/" +
                              person.email +
                              "/" +
                              response.token +
                              "\n\nThank You!\n",
                          };

                          transporter.sendMail(mailOptions, function (err) {
                            if (err) {
                              return res.status(500).send({
                                msg: "Technical Issue!, Please click on resend for verify your Email.",
                              });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Verification Link sent" });
                            }
                          });
                        })
                        .catch((err) => {
                          res.status(500).json({ msg: err });
                        });
                    }
                  })
                  .catch((err) => res.status(500).json({ msg: err }));
              })
              .catch((err) => res.status(500).json(err));
          });
        });
      }

      //return res.status(400).json('Email already registered');
    })
    .catch((err) => res.status(500).json(err));
};

Authcontroller.mailVerification = (req, res) => {
  TokenModal.findOne({ token: req.params.token })
    .then((token) => {
      if (!token) {
        return res.status(400).send({
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });
      } else {
        UserModal.findOne({ email: req.params.email }).then((user) => {
          console.log(user);
          if (!user) {
            return res
              .status(404)
              .json({ msg: "Sorry! we couldnt find any user" });
          } else if (user.verified) {
            return res.status(404).json({ msg: "Email is verified already!" });
          } else {
            user.verified = true;

            user
              .save()
              .then((response) => {
                return res
                  .status(200)
                  .json({ msg: "Email verified successfully" });
              })
              .catch((err) => res.status(400).json({ msg: err }));
          }
        });
      }
    })
    .catch((err) => res.status(400).json({ msg: err }));
};

Authcontroller.login = (req, res) => {
  const { email, password } = req.body;
  UserModal.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ msg: "Invalid email!" });
      } else if (!user.verified) {
        return res.status(404).json({ msg: "User not verified" });
      }

      bcrypt
        .compare(password, user.password)
        .then((isCorrect) => {
          if (isCorrect) {
            const payload = {
              id: user._id,
              name: user.name,
              email: user.email,
            };

            jsonwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: token,
              });
            });
          } else {
            return res
              .status(400)
              .json({ passworderror: "login error password incorrect" });
          }
        })
        .catch((err) => {
          return res.status(500).json({ msg: err });
        });
    })
    .catch((err) => {
      return res.status(500).json({ msg: err });
    });
};

module.exports = Authcontroller;
