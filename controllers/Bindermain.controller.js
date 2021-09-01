const Maincontroller = {};
const mongoose = require("mongoose");
const Userinfo = require("../models/UserinfoSchema");
const User = require("../models/UserSchema");
const Usermatch = require("../models/UsermatchSchema");
const { EventEmitter } = require("events");
const transporter = require("../setup/mailTransporter");
const UserModal = require("../models/UserSchema");
const MatchModal = require("../models/MatchSchema");
const MatchEmitter = new EventEmitter();

MatchEmitter.on("send_mail", (mail, recipent, sendername) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: mail,
    subject: `${recipent} and ${sendername} are friends!`,
    text: `Congratulations! we have added ${sendername} to your network! `,
  };

  transporter
    .sendMail(mailOptions)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

MatchEmitter.on("request_accepted", async (uid, pid, res) => {
  let username, partner;
  UserModal.findOne({ _id: uid })
    .then(async (user) => {
      username = user?.name;
      usermail = user?.email;

      UserModal.findOne({ _id: pid })
        .then(async (person) => {
          partner = person?.name;
          partnermail = person?.email;

          let senders = [
            {
              mail: usermail,
              recipentname: username,
              sender: partner,
            },
            {
              mail: partnermail,
              recipentname: username,
              partner,
              sender: username,
            },
          ];

          await Promise.all(
            senders.map((key) => {
              MatchEmitter.emit(
                "send_mail",
                key.mail,
                key.recipentname,
                key.sender
              );
            })
          );

          return res.status(200).json({ msg: "request accepted!!" });
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(user);
    })
    .catch((err) => console.log(err));
});

MatchEmitter.on("match_found", (u_id, p_id, res) => {
  UserModal.findOne({ _id: p_id })
    .then((user) => {
      console.log(user);
      if (user) {
        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: "One new Request",
          text: `Hello! ${user.name}  you have one new connection request! Visit the app to respond`,
        };

        transporter
          .sendMail(mailOptions)
          .then((response) => {
            console.log(response);
            let payload = {
              u_id: u_id,
              p_id: p_id,
            };

            return res.status(200).json(payload);
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
});

///

Maincontroller.getAllUser = async (req, res) => {
  const { uid } = req.params;
  console.log(uid);
  await MatchModal.findOne({ u_id: uid })
    .then(async (response) => {
      console.log(response);
      let friendids = [];

      response?.matches.map((key) => {
        friendids.push(key.p_id.toString());
      });

      console.log(friendids, "friend ids are here");

      await Userinfo.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "newDocs",
          },
        },
      ]).exec((err, result) => {
        if (err) {
          return res.status(400).json(err);
        }

        let payload = [];
        console.log(friendids.includes("61178a682413fca6949e117e"));
        result.map((key, index) => {
          if (
            !friendids.includes(key.userId.toString()) &&
            uid.toString() !== key.userId.toString()
          ) {
            let age = _calculateAge(key.dob);
            let doc = {
              userId: key.userId,
              age: age,
              location: key.location,
              book_list: key.book_list,
              interest: key.interest,
              book_offering: key.book_offering,
              fav_quote: key.fav_quote,
              social_url: key.social_url,
              name: key.newDocs[0].name,
              email: key.newDocs[0].email,
            };

            payload.push(doc);
          }
        });

        return res.status(200).json(payload);
      });
      //}
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};

Maincontroller.connectUser = async (req, res) => {
  let u_id = req.params.userid;
  let p_id = req.params.partnerid;

  await MatchModal.findOne({ u_id: u_id })
    .then((user) => {
      if (!user) {
        UserModal.findOne({ _id: p_id })
          .then((response) => {
            const newUser = new MatchModal({
              u_id: u_id,
              matches: [
                {
                  p_id: p_id,
                  status: false,
                  name: response.name,
                  email: response.email,
                },
              ],
            });

            newUser
              .save()
              .then((response) => {
                MatchEmitter.emit("match_found", u_id, p_id, res);

                return res.status(200).json(response);
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json(response);
              });
          })
          .catch((err) => {
            return res.status(200).json(err);
          });
      } else {
        UserModal.findOne({ _id: p_id })
          .then((response) => {
            let doc = {
              p_id: p_id,
              status: false,
              name: response.name,
              email: response.email,
            };

            user?.matches.push(doc);

            user
              .save()
              .then((response) => {
                MatchEmitter.emit("match_found", u_id, p_id, res);

                return res.status(200).json(response);
              })
              .catch((err) => {
                return res.status(400).json(err);
              });
          })
          .catch((err) => {
            return res.status(400).json(err);
          });
      }
    })
    .catch((err) => console.log(err));
};
///

Maincontroller.acceptRequest = async (req, res) => {
  const { uid, pid } = req.params;

  await MatchModal.findOne({ u_id: uid })
    .then((user) => {
      if (user) {
        user.matches.map((key) => {
          if (mongoose.Types.ObjectId(pid).equals(key.p_id)) {
            key.status = true;

            user
              .save()
              .then((response) => {
                MatchEmitter.emit("request_accepted", uid, pid, res);

                MatchModal.findOne({ u_id: pid })
                  .then((res) => {
                    if (!res) {
                      UserModal.findOne({ _id: uid })
                        .then((data) => {
                          const newFriend = new MatchModal({
                            u_id: pid,
                            matches: [
                              {
                                p_id: uid,
                                status: true,
                                name: data.name,
                                email: data.email,
                              },
                            ],
                          });

                          newFriend
                            .save()
                            .then((ans) => {
                              return res.status(200).json(response);
                            })
                            .catch((err) => {
                              return res.status(400).json(err);
                            });
                        })
                        .catch((err) => {
                          return res.status(400).json(err);
                        });
                    } else {
                      UserModal.findOne({ _id: uid })
                        .then((ans) => {
                          let doc = {
                            p_id: uid,
                            status: true,
                            name: ans.name,
                            email: ans.email,
                          };

                          res?.matches.push(doc);

                          res
                            .save()
                            .then((result) => {
                              return res.status(200).json(result);
                            })
                            .catch((err) => {
                              return res.status(400).json(err);
                            });
                        })
                        .catch((err) => {
                          return res.status(400).json(err);
                        });
                    }
                  })
                  .catch((err) => {
                    return res.status(400).json(err);
                  });
              })
              .catch((err) => {
                return res.status(400).json(err);
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};

///

Maincontroller.getMatchRequest = async (req, res) => {
  const { uid } = req.params;

  await MatchModal.findOne({ u_id: uid })
    .then((user) => {
      if (user) {
        let payload = [];

        user.matches.map((key) => {
          if (key.status === false) {
            let doc = {
              p_id: key.p_id,
              name: key.name,
              email: key.email,
              date: key.date,
            };

            payload.push(doc);
          }
        });

        return res.status(200).json(payload);
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

//

Maincontroller.getFriendlist = async (req, res) => {
  const { uid } = req.params;

  await MatchModal.findOne({ u_id: uid })
    .then((user) => {
      if (user) {
        let payload = [];

        user.matches.map((key) => {
          if (key.status === true) {
            let doc = {
              p_id: key.p_id,
              name: key.name,
              email: key.email,
              date: key.date,
            };

            payload.push(doc);
          }
        });

        return res.status(200).json(payload);
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};

///
Maincontroller.deleteFriend = async (req, res) => {
  const { uid, pid } = req.params;
  await MatchModal.updateOne(
    { u_id: uid },
    {
      $pull: { matches: { p_id: pid } },
    },
    {
      safe: true,
    }
  )
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};
//
Maincontroller.getUserInfo = async (req, res) => {
  const { pid } = req.params;
  await Userinfo.findOne({ userId: pid })
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};
//

Maincontroller.removeFriend = async (req, res) => {
  const { uid, pid } = req.params;
  await MatchModal.findOne({ u_id: uid })
    .then((user) => {
      console.log(user);
      if (user) {
        user.matches = user?.matches.filter(function (key) {
          return !mongoose.Types.ObjectId(pid).equals(key.p_id);
        });

        user
          .save()
          .then((result) => {
            return res.status(200).json(result);
          })
          .catch((err) => {
            return res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};
//

function _calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

module.exports = Maincontroller;
