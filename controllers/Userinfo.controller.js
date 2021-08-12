const Userinfo = require("../models/UserinfoSchema");
const UserModal = require("../models/UserSchema");
const UserInfoController = {};

UserInfoController.saveData = async (req, res) => {
  console.log(req.body)
  const { email } = req.body || {};

  Userinfo.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const newUser = new Userinfo(req.body);

        newUser
          .save()
          .then((response) => {
            UserModal.findOne({ _id: response.userId })
              .then((user) => {
                if (user) {
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

            // return res.status(200).json({ msg: response });
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
