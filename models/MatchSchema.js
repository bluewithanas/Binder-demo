const mongoose = require("mongoose");

const { Schema } = mongoose;

const MatchSchema = new Schema({
  u_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  matches:[
    {
      p_id:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
      },
      name:{
        type: String,
        required: true
      },

      email:{
        type: String,
        required: true
      },

      status:{
        type: Boolean,
        required: true,
        default: false
      },

      date:{
        type: Date,
        default: Date.now(),
      }
    }
  ]
});

module.exports = MatchModal = mongoose.model("match",  MatchSchema);
