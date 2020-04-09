const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { USER_ALREADY_IN_GROUP, NOT_FOUND } = require("../constants/errorCodes");
const { USER, GROUP } = require("../constants/resources");

const GroupSchema = new Schema({
    name: {
        type: String,
        max: 30
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: USER
        }
    ],
    messages: [
        {
            text: {
                type: String,
                required: true
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: USER
            }
        }
    ]
});

GroupSchema.methods.addUser = async function(user_id) {
    if (!this.participants.includes(user_id)) {
        this.participants.push(user_id);
        await this.save();
    } else {
        throw new Error(USER_ALREADY_IN_GROUP);
    }
};

GroupSchema.methods.leave = async function(user_id) {
    let index;

    for (let i = 0; i < this.participants.length; i++) {
        if (this.participants[i].toString() === user_id) index = i;
    }

    if (!index) {
        throw new Error(NOT_FOUND);
    }

    this.participants[index] = undefined;
    await this.save();
};

const GroupModel = mongoose.model(GROUP, GroupSchema);

module.exports = GroupModel;
