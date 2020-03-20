const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT,
  INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
} = require("../variables/errorKeys");

const DiveSchema = new Schema({
  time_in: Date,
  time_out: Date,
  bottom_time: Number,
  safety_stop_time: Number,
  dive_time: Number,
  max_depth: Number,
  location: String,
  description: String,
  club: {
    type: Schema.Types.ObjectId,
    ref: "Club"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  buddies: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  gear: [
    {
      type: Schema.Types.ObjectId,
      ref: "Gear"
    }
  ],
  public: {
    type: Boolean,
    default: false
  }
});

DiveSchema.pre("save", function(next) {
  this.dive_time = (this.time_out - this.time_in) / 60000;

  if (this.dive_time < 0)
    throw new Error(INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT);

  if (this.dive_time < this.bottom_time + this.safety_stop_time) {
    throw new Error(INVALID_ARGUMENT_DIVE_TIME_EXCEEDED);
  }

  next();
});

module.exports = mongoose.model("Dive", DiveSchema);
