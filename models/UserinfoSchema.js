const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserinfoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  dob: {
    type: Date,
    required: true,
  },

  interest: [String],

  location: {
    type: String,
    required: true,
  },

  book_list: [String],

  book_offering: {
    type: String,
    required: true,
  },

  fav_quote: {
    type: String,
    required: true,
  },

  social_url: {
    type: String,
    required: true,
  },
  
});

module.exports = Userinfo = mongoose.model("Userinfo", UserinfoSchema);
