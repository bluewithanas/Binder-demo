const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  first_login: {
    type: Boolean,
    default: true,
  },
});

module.exports = UserModal = mongoose.model("User", UserSchema);
