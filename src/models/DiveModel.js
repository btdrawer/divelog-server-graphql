const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT,
  INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
} = require("../constants/errorCodes");

const DiveSchema = new Schema({
  timeIn: Date,
  timeOut: Date,
  bottomTime: Number,
  safetyStopTime: Number,
  diveTime: Number,
  maxDepth: Number,
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
  this.diveTime = (this.timeOut - this.timeIn) / 60000;

  if (this.diveTime < 0)
    throw new Error(INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT);

  if (this.diveTime < this.bottomTime + this.safetyStopTime) {
    throw new Error(INVALID_ARGUMENT_DIVE_TIME_EXCEEDED);
  }

  next();
});

module.exports = mongoose.model("Dive", DiveSchema);
