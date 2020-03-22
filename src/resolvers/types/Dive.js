const UserModel = require("../../models/UserModel");
const ClubModel = require("../../models/ClubModel");
const GearModel = require("../../models/GearModel");

module.exports = {
    club: ({ club }) =>
        ClubModel.findOne({
            _id: club
        }),
    user: ({ user }) =>
        UserModel.findOne({
            _id: user
        }),
    buddies: ({ buddies }) =>
        UserModel.find({
            _id: {
                $in: buddies
            }
        }),
    gear: ({ gear }) =>
        GearModel.find({
            _id: {
                $in: gear
            }
        })
};
