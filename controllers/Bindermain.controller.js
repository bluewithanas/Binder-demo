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
const { redis } = require("../setup/redis");

const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_APIKEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

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

MatchEmitter.on("request_accepted", async (uid, pid) => {
  await UserModal.findOne({ _id: uid })
    .then(async (user) => {
      if (user) {
        await UserModal.findOne({ _id: pid })
          .then((friend) => {
            sendSmtpEmail.sender = {
              name: "Binder",
              email: "binderofficialind@gmail.com",
            };
            sendSmtpEmail.to = [
              {
                email: user.email,
                name: user.name,
              },

              {
                email: friend.email,
                name: friend.name,
              },
            ];

            sendSmtpEmail.params = {
              PARTNER_NAME: friend.name,
              FIRSTNAME: user.name,
            };
            sendSmtpEmail.templateId = 10;

            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log(
                  "API called successfully. Returned data: " +
                    JSON.stringify(data)
                );
              },
              function (error) {
                console.error(error);
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

MatchEmitter.on("match_found", (u_id, p_id) => {
  UserModal.findOne({ _id: p_id })
    .then((partner) => {
      if (partner) {
        UserModal.findOne({ _id: u_id })
          .then((user) => {
            sendSmtpEmail.sender = {
              name: "Binder",
              email: "binderofficialind@gmail.com",
            };
            sendSmtpEmail.to = [
              {
                email: partner.email,
                name: partner.name,
              },
            ];

            sendSmtpEmail.params = {
              PARTNER_NAME: user.name,
              FIRSTNAME: partner.name,
            };
            sendSmtpEmail.templateId = 9;

            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log(
                  "API called successfully. Returned data: " +
                    JSON.stringify(data)
                );
              },
              function (error) {
                console.error(error);
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

///

Maincontroller.getAllUser = async (req, res) => {
  const { uid } = req.params;

  let cacheKey = `userlist:${uid}`;
  redis.get(cacheKey, function (err, data) {
    if (err || data === null) {
      console.log("we are inside");
      MatchModal.findOne({ u_id: mongoose.Types.ObjectId(uid) || uid })
        .then(async (response) => {
          let friendids = [];

          response?.matches.map((key) => {
            friendids.push(key.p_id.toString());
          });

          Userinfo.aggregate([
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
                  name: key.newDocs[0]?.name,
                  email: key.newDocs[0]?.email,
                };

                payload.push(doc);
              }
            });

            redis.set(cacheKey, JSON.stringify(payload), function (err) {
              if (err) {
                console.log(err);
              } else {
                redis.get(cacheKey, function (err, value) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            });

            return res.status(200).json(payload);
          });
          //}
        })
        .catch((err) => {
          console.log(err);
          console.log("get all user line 224");

          return res.status(400).json(err);
        });
    } else {
      return res.status(200).json(JSON.parse(data));
    }
  });
};

Maincontroller.connectUser = async (req, res) => {
  let u_id = req.params.userid;
  let p_id = req.params.partnerid;

  await MatchModal.findOne({ u_id: p_id })
    .then((user) => {
      if (!user) {
        UserModal.findOne({ _id: u_id })
          .then((response) => {
            const newUser = new MatchModal({
              u_id: p_id,
              matches: [
                {
                  p_id: u_id,
                  status: false,
                  name: response.name,
                  email: response.email,
                },
              ],
            });

            newUser
              .save()
              .then((response1) => {
                MatchEmitter.emit("match_found", u_id, p_id);

                redis.get(`userlist:${u_id}`, function (err, data) {
                  if (err) {
                    console.log(err);
                  }

                  let userlist = JSON.parse(data);

                  userlist = userlist.filter((key) => key.userId !== p_id);

                  redis.set(
                    `userlist:${u_id}`,
                    JSON.stringify(userlist),
                    function (err) {
                      if (err) {
                        console.log(err);
                      }

                      redis.get(`userlist:${u_id}`, function (err, data) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  );

                  // return res.status(200).json({msg: "request sent"})
                });

                return res.status(200).json({ msg: "Connection request sent" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json(err);
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json(err);
          });
      } else {
        UserModal.findOne({ _id: u_id })
          .then((response) => {
            console.log(response);

            let doc = {
              p_id: u_id,
              status: false,
              name: response.name,
              email: response.email,
            };

            user?.matches.push(doc);

            user
              .save()
              .then((response) => {
                MatchEmitter.emit("match_found", u_id, p_id);

                redis.get(`userlist:${u_id}`, function (err, data) {
                  if (err) {
                    console.log(err);
                  }

                  let userlist = JSON.parse(data);

                  userlist = userlist.filter((key) => key.userId !== p_id);

                  console.log(userlist, "updated list after connect");

                  redis.set(
                    `userlist:${u_id}`,
                    JSON.stringify(userlist),
                    function (err) {
                      if (err) {
                        console.log(err);
                      }

                      redis.get(`userlist:${u_id}`, function (err, data) {
                        if (err) {
                          console.log(err);
                        }
                      });
                    }
                  );
                });

                return res.status(200).json({ msg: "connection request sent" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json(err);
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};
///

Maincontroller.acceptRequest = async (req, res) => {
  const { uid, pid } = req.params;
  console.log(uid, pid);
  await MatchModal.findOne({ u_id: uid })
    .then((user) => {
      if (user) {
        user.matches.map((key) => {
          if (mongoose.Types.ObjectId(pid).equals(key.p_id)) {
            key.status = true;

            user
              .save()
              .then((response) => {
                MatchEmitter.emit("request_accepted", uid, pid);

                MatchModal.findOne({ u_id: pid })
                  .then((user1) => {
                    if (!user1) {
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
                              console.log(
                                "i am the document here you wanted to see",
                                ans
                              );

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

                          user1?.matches.push(doc);

                          user1
                            .save()
                            .then((result) => {
                              MatchEmitter.emit("request_accepted", uid, pid);

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

  MatchModal.findOne({ u_id: uid })
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
      console.log("fetching friend list");
      return res.status(400).json(err);
    });
};

///

const addFriendtoCache = async (uid, pid) => {
  await MatchModal.findOne({ u_id: uid })
    .then(async (response) => {
      let friendids = [];

      response?.matches.map((key) => {
        friendids.push(key.p_id.toString());
      });

      Userinfo.aggregate([
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

        let cacheKey = `userlist:${uid}`;

        redis.set(cacheKey, JSON.stringify(payload), function (err) {
          if (err) {
            console.log(err);
            return err;
          } else {
            redis.get(cacheKey, function (err, value) {
              if (err) {
                console.log(err);
                return err;
              } else {
                console.log(JSON.parse(value));
                return value;
              }
            });
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
};

Maincontroller.deleteFriend = async (req, res) => {
  const { uid, pid } = req.params;
  await MatchModal.updateOne(
    { u_id: pid },
    {
      $pull: { matches: { p_id: uid } },
    },
    {
      safe: true,
    }
  )
    .then(async (user) => {
      let res = await addFriendtoCache(uid, pid);
      console.log(res);
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
  const cacheKey = `userinfo:${pid}`;

  redis.get(cacheKey, function (err, data) {
    if (err || data === null) {
      Userinfo.findOne({ userId: pid })
        .then((response) => {
          redis.set(cacheKey, JSON.stringify(response), function (err) {
            if (err) {
              console.log(err);
            }

            redis.get(cacheKey, function (err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log(JSON.parse(data));
              }
            });
          });

          return res.status(200).json(response);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json(err);
        });
    } else {
      console.log("coming from cache");
      console.log(JSON.parse(data));
      return res.status(200).json(JSON.parse(data));
    }
  });
};
//

Maincontroller.removeFriend = async (req, res) => {
  //remove friend from both the fields
  const { uid, pid } = req.params;
  await MatchModal.findOne({ u_id: mongoose.Types.ObjectId(pid) })
    .then((user) => {
      console.log(user);
      if (user) {
        user.matches = user?.matches.filter(function (key) {
          return !mongoose.Types.ObjectId(uid).equals(key.p_id);
        });

        user
          .save()
          .then(async (result) => {
            await MatchModal.findOne({ u_id: mongoose.Types.ObjectId(uid) })
              .then((ans) => {
                if (ans) {
                  ans.matches = user?.matches.filter(function (key) {
                    return !mongoose.Types.ObjectId(pid).equals(key.p_id);
                  });

                  ans
                    .save()
                    .then(async (output) => {
                      let answer = await addFriendtoCache(uid, pid);
                      console.log(answer);

                      return res.status(200).json(output);
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(400).json(err);
                    });
                }
              })
              .catch((err) => {
                console.log(err);
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
};
//

Maincontroller.logout = async (req, res) => {
  //remove friend from both the fields
  const { uid } = req.params;
  console.log(uid, "logout ");
  const cacheKey = `userlist:${uid}`;

  redis.del(cacheKey, function (err, reply) {
    console.log("cleaned up");
    if (err) {
      console.log(err);
    } else {
      console.log(reply);
      console.log("cache cleaned");
      return res.status(200).json({ result: reply });
    }
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
