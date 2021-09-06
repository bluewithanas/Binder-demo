const Authcontroller = {};
const UserModal = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const TokenModal = require("../models/TokenSchema");
const transporter = require("../setup/mailTransporter");
const jsonwt = require("jsonwebtoken");
const { secret } = require("../setup/mongourl");
const passport = require("passport");
const { emailregex, passregex } = require("./Utils/validators");

function EmailValidator(email) {
  return emailregex.test(String(email));
}

function PasswordValidator(password) {
  return passregex.test(String(password));
}

function passwordMatcher(password, confirmPassword) {
  return password === confirmPassword;
}

const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_APIKEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

Authcontroller.register = async (req, res) => {
  const {
    name = "",
    email = "",
    password = "",
    confirmPassword = "",
  } = req.body || {};

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are mandatory to fill!" });
  }

  if (!EmailValidator(email)) {
    return res.status(400).json({ msg: "Please enter a valid email" });
  }

  if (!PasswordValidator(password)) {
    return res.status(400).json({ msg: "Please enter a Strong password" });
  }

  if (!passwordMatcher(password, confirmPassword)) {
    return res.status(400).json({ msg: "Passwords doesnt match" });
  }

  UserModal.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: "email already exists" });
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
                          sendSmtpEmail.sender = {
                            name: "Binder",
                            email: "binderofficialind@gmail.com",
                          };
                          sendSmtpEmail.to = [
                            {
                              email: person.email,
                              name: person.name,
                            },
                          ];

                          sendSmtpEmail.params = {
                            FIRSTNAME: person.name,
                            VERIFICATION_LINK:
                              "\nhttp://" +
                              req.headers.host +
                              "/auth/confirmation/" +
                              person.email +
                              "/" +
                              response.token,
                          };
                          sendSmtpEmail.templateId = 7;

                          apiInstance.sendTransacEmail(sendSmtpEmail).then(
                            function (data) {
                              console.log(
                                "API called successfully. Returned data: " +
                                  JSON.stringify(data)
                              );

                              return res
                                .status(200)
                                .json({ msg: "Verification link sent" });
                            },
                            function (error) {
                              console.error(error);
                              return JSON.stringify(error);
                            }
                          );
                        })
                        .catch((err) => {
                          res.status(500).json({ msg: err });
                        });
                    }
                  })
                  .catch((err) => {
                    res.status(500).json({ msg: err });
                  });
              })
              .catch((err) => {
                res.status(500).json(err);
              });
          });
        });
      }

      //return res.status(400).json({msg:'email already registered'});
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
  const { email, password } = req.body || {};
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
              first_login: user.first_login,
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
              .json({ msg: "login error password incorrect" });
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

module.exports = {
  EmailValidator,
  passwordMatcher,
  PasswordValidator,
};

module.exports = Authcontroller;
