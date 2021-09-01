const Userinfo = require("../models/UserinfoSchema");
const UserModal = require("../models/UserSchema");
const UserInfoController = {};

UserInfoController.saveData = async (req, res) => {
  const { email } = req.body || {};
  console.log(email);
  Userinfo.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (!user) {
        const newUser = new Userinfo(req.body);

        newUser
          .save()
          .then((response) => {
            console.log(response);
            UserModal.findOne({ _id: response.userId })
              .then((user) => {
                if (user) {
                  console.log(user);
                  user.first_login = false;

                  user
                    .save()
                    .then((response) => {
                      return res.status(200).json({ msg: response });
                    })
                    .catch((err) => {
                      return res.status(400).json({ msg: err });
                    });
                }
              })
              .catch((err) => {
                return res.status(400).json({ msg: err });
              });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err });
          });
      }
    })
    .catch((err) => {
      return res.status(400).json({ msg: err });
    });
};

module.exports = UserInfoController;
