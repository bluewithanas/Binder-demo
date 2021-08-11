const mongoose = require("mongoose");

const { Schema } = mongoose;

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,

    required: true,
    ref: "User",
  },

  token: {
    type: String,
    required: true,
  },
});

module.exports = TokenModal = mongoose.model("Token", TokenSchema);
