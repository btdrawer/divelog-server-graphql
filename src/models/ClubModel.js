const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { USER, CLUB } = require("../constants/resources");

const ClubSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 30
    },
    location: {
        type: String,
        required: true,
        max: 50
    },
    description: {
        type: String
    },
    managers: [
        {
            type: Schema.Types.ObjectId,
            ref: USER,
            required: true
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: USER,
            required: true
        }
    ],
    website: {
        type: String,
        max: 40
    }
});

module.exports = mongoose.model(CLUB, ClubSchema);
