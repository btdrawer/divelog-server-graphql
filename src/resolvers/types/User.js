const ClubModel = require("../../models/ClubModel");

module.exports = {
    email: ({ id, email }, args, { authUserId }) =>
        authUserId && authUserId === id ? email : null,
    dives: ({ dives }, args, { loaders }) =>
        dives.map(async dive => await loaders.diveLoader.load(dive.toString())),
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
    gear: ({ id, gear }, args, { authUserId, loaders }) => {
        if (authUserId && authUserId === id) {
            return gear.map(async gearId =>
                loaders.gearLoader.load(gearId.toString())
            );
        }
        return null;
    },
    friends: ({ id, friends }, args, { authUserId, loaders }) => {
        if (authUserId && authUserId === id) {
            return friends.map(async friend =>
                loaders.userLoader.load(friend.toString())
            );
        }
        return null;
    },
    friendRequests: async (
        { id, friendRequests },
        args,
        { authUserId, loaders }
    ) => {
        if (authUserId && authUserId === id) {
            const [inbox, sent] = await Promise.all([
                friendRequests.inbox.map(async request =>
                    loaders.userLoader.load(request.toString())
                ),
                friendRequests.sent.map(async request =>
                    loaders.userLoader.load(request.toString())
                )
            ]);
            return {
                inbox,
                sent
            };
        }
        return null;
    }
};
