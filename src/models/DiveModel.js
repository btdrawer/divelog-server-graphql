const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
    INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT,
    INVALID_ARGUMENT_DIVE_TIME_EXCEEDED
} = require("../constants/errorCodes");
const { USER, DIVE, CLUB, GEAR } = require("../constants/resources");
const moment = require("moment");

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
        ref: CLUB
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    buddies: [
        {
            type: Schema.Types.ObjectId,
            ref: USER
        }
    ],
    gear: [
        {
            type: Schema.Types.ObjectId,
            ref: GEAR
        }
    ],
    public: {
        type: Boolean,
        default: false
    }
});

DiveSchema.pre("save", function(next) {
    this.diveTime = (this.timeOut - this.timeIn) / 60000;

    if (this.diveTime < 0) {
        throw new Error(INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT);
    }

    if (this.diveTime < this.bottomTime + this.safetyStopTime) {
        throw new Error(INVALID_ARGUMENT_DIVE_TIME_EXCEEDED);
    }

    next();
});

DiveSchema.pre("findOneAndUpdate", async function(next) {
    if (this._update.timeIn || this._update.timeOut) {
        const dive = await DiveModel.findOne({
            _id: this._conditions._id
        });

        if (this._update.timeIn) {
            this._update.timeIn = moment(this._update.timeIn).format("x");
        }
        if (this._update.timeOut) {
            this._update.timeOut = moment(this._update.timeOut).format("x");
        }

        this._update.diveTime =
            ((this._update.timeOut || dive.timeOut) -
                (this._update.timeIn || dive.timeIn)) /
            60000;

        if (this.diveTime < 0) {
            throw new Error(INVALID_ARGUMENT_TIME_IN_LATER_THAN_OUT);
        }

        if (this.diveTime < this.bottomTime + this.safetyStopTime) {
            throw new Error(INVALID_ARGUMENT_DIVE_TIME_EXCEEDED);
        }
    }

    next();
});

const DiveModel = mongoose.model(DIVE, DiveSchema);

module.exports = DiveModel;
