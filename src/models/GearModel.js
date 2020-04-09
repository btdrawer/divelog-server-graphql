const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { USER, GEAR } = require("../constants/resources");

const GearSchema = new Schema({
    name: {
        type: String,
        max: 30
    },
    model: {
        type: String,
        max: 30
    },
    brand: {
        type: String,
        max: 30
    },
    type: {
        type: String,
        max: 30
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: USER
    }
});

module.exports = mongoose.model(GEAR, GearSchema);
