const { combineResolvers } = require("graphql-resolvers");
const { models, errorCodes } = require("@btdrawer/divelog-server-utils");
const { ClubModel, UserModel } = models;
const {
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER
} = errorCodes;
const {
    isAuthenticated,
    clearClubCache,
    isClubManager,
    isClubMember
} = require("../middleware");

module.exports = {
    createClub: combineResolvers(
        isAuthenticated,
        clearClubCache,
        async (parent, { data }, { authUserId }) => {
            const club = new ClubModel({
                ...data,
                managers: [authUserId]
            });
            await club.save();
            await UserModel.findByIdAndUpdate(
                authUserId,
                {
                    $push: {
                        "clubs.manager": club.id
                    }
                },
                { new: true }
            );
            return club;
        }
    ),
    updateClub: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        (parent, { id, data }) =>
            ClubModel.findByIdAndUpdate(id, data, { new: true })
    ),
    addClubManager: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        async (parent, { id, userId }) => {
            const { managers } = await ClubModel.findById(id);
            if (managers.includes(userId)) {
                throw new Error(ALREADY_A_MANAGER);
            }
            const club = await ClubModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        managers: userId
                    }
                },
                { new: true }
            );
            await UserModel.findByIdAndUpdate(userId, {
                $push: {
                    "clubs.manager": club.id
                }
            });
            return club;
        }
    ),
    removeClubManager: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        async (parent, { id, userId }) => {
            const { managers } = await ClubModel.findById(id);
            if (!managers.includes(userId)) {
                throw new Error(NOT_A_MANAGER);
            }
            const club = await ClubModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        managers: userId
                    }
                },
                { new: true }
            );
            await UserModel.findByIdAndUpdate(userId, {
                $pull: {
                    "clubs.manager": club.id
                }
            });
            return club;
        }
    ),
    joinClub: combineResolvers(
        isAuthenticated,
        clearClubCache,
        async (parent, { id }, { authUserId }) => {
            const { members } = await ClubModel.findById(id);
            if (members.includes(authUserId)) {
                throw new Error(ALREADY_A_MEMBER);
            }
            const club = await ClubModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        members: authUserId
                    }
                },
                { new: true }
            );
            await UserModel.findByIdAndUpdate(authUserId, {
                $push: {
                    "clubs.member": club.id
                }
            });
            return club;
        }
    ),
    leaveClub: combineResolvers(
        isAuthenticated,
        isClubMember,
        clearClubCache,
        async (parent, { id }, { authUserId }) => {
            const { members } = await ClubModel.findById(id);
            if (!members.includes(authUserId)) {
                throw new Error(NOT_A_MEMBER);
            }
            const club = await ClubModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        members: authUserId
                    }
                },
                { new: true }
            );
            await UserModel.findByIdAndUpdate(authUserId, {
                $pull: {
                    "clubs.member": club.id
                }
            });
            return club;
        }
    ),
    removeClubMember: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        async (parent, { id, userId }) => {
            const { members } = await ClubModel.findById(id);
            if (!members.includes(userId)) {
                throw new Error(NOT_A_MEMBER);
            }
            const club = await ClubModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        members: userId
                    }
                },
                { new: true }
            );
            await UserModel.findByIdAndUpdate(userId, {
                $pull: {
                    "clubs.member": club.id
                }
            });
            return club;
        }
    ),
    deleteClub: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        async (parent, { id }) => {
            await UserModel.updateMany(
                {
                    clubs: {
                        manager: id
                    }
                },
                {
                    $pull: {
                        "clubs.manager": id
                    }
                }
            );
            await UserModel.updateMany(
                {
                    clubs: {
                        member: id
                    }
                },
                {
                    $pull: {
                        "clubs.member": id
                    }
                }
            );
            return ClubModel.findByIdAndDelete(id);
        }
    )
};
