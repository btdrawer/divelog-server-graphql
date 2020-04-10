const UserModel = require("../../models/UserModel");
const DiveModel = require("../../models/DiveModel");
const ClubModel = require("../../models/ClubModel");
const GearModel = require("../../models/GearModel");

module.exports = {
    email: ({ id, email }, args, { authUserId }) => {
        if (authUserId && authUserId === id) {
            return email;
        }
        return undefined;
    },
    dives: ({ dives }) =>
        DiveModel.find({
            _id: {
                $in: dives
            }
        }),
    clubs: async ({ clubs }) => {
        const [manager, member] = await Promise.all([
            ClubModel.find({
                _id: {
                    $in: clubs.manager
                }
            }),
            ClubModel.find({
                _id: {
                    $in: clubs.member
                }
            })
        ]);
        return {
            manager,
            member
        };
    },
    gear: ({ id, gear }, args, { authUserId }) => {
        if (authUserId && authUserId === id) {
            return GearModel.find({
                _id: {
                    $in: gear
                }
            });
        }
        return undefined;
    },
    friends: ({ id, friends }, args, { authUserId }) => {
        if (authUserId && authUserId === id) {
            return UserModel.find({
                _id: {
                    $in: friends
                }
            });
        }
        return undefined;
    },
    friendRequests: async ({ id, friendRequests }, args, { authUserId }) => {
        if (authUserId && authUserId === id) {
            const [inbox, sent] = await Promise.all([
                UserModel.find({
                    _id: {
                        $in: friendRequests.inbox
                    }
                }),
                UserModel.find({
                    _id: {
                        $in: friendRequests.sent
                    }
                })
            ]);
            return {
                inbox,
                sent
            };
        }
        return undefined;
    }
};
