const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GearSchema = new Schema({
  brand: {
    type: String,
    max: 30
  },
  name: {
    type: String,
    max: 30
  },
  type: {
    type: String,
    max: 30
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Gear", GearSchema);
