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

const MANAGERS = "managers";
const MEMBERS = "members";

const checkArrayTemplate = async ({
    arrName,
    clubId,
    userId,
    err,
    shouldInclude
}) => {
    const club = await ClubModel.findById(clubId);
    const arr = club[arrName];
    const predicate = shouldInclude
        ? !arr.includes(userId)
        : arr.includes(userId);
    if (predicate) {
        throw new Error(err);
    }
    return undefined;
};

const updateTemplate = async ({ club, user, check }) => {
    await checkArrayTemplate({
        clubId: club.id,
        userId: user.id,
        ...check
    });
    const updatedClub = await ClubModel.findByIdAndUpdate(
        club.id,
        club.payload,
        { new: true }
    );
    await UserModel.findByIdAndUpdate(user.id, user.payload);
    return updatedClub;
};

module.exports = {
    createClub: combineResolvers(
        isAuthenticated,
        clearClubCache,
        async (parent, { data }, { authUserId }) => {
            const club = await new ClubModel({
                ...data,
                managers: [authUserId]
            }).save();
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
        (parent, { id: clubId, userId }) =>
            updateTemplate({
                club: {
                    id: clubId,
                    payload: {
                        $push: {
                            managers: userId
                        }
                    }
                },
                user: {
                    id: userId,
                    payload: {
                        $push: {
                            "clubs.manager": clubId
                        }
                    }
                },
                check: {
                    arrName: MANAGERS,
                    shouldInclude: false,
                    err: ALREADY_A_MANAGER
                }
            })
    ),
    removeClubManager: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        (parent, { id: clubId, userId }) =>
            updateTemplate({
                club: {
                    id: clubId,
                    payload: {
                        $pull: {
                            managers: userId
                        }
                    }
                },
                user: {
                    id: userId,
                    payload: {
                        $pull: {
                            "clubs.manager": clubId
                        }
                    }
                },
                check: {
                    arrName: MANAGERS,
                    shouldInclude: true,
                    err: NOT_A_MANAGER
                }
            })
    ),
    joinClub: combineResolvers(
        isAuthenticated,
        clearClubCache,
        (parent, { id: clubId }, { authUserId }) =>
            updateTemplate({
                club: {
                    id: clubId,
                    payload: {
                        $push: {
                            members: authUserId
                        }
                    }
                },
                user: {
                    id: authUserId,
                    payload: {
                        $push: {
                            "clubs.member": clubId
                        }
                    }
                },
                check: {
                    arrName: MEMBERS,
                    shouldInclude: false,
                    err: ALREADY_A_MEMBER
                }
            })
    ),
    leaveClub: combineResolvers(
        isAuthenticated,
        isClubMember,
        clearClubCache,
        (parent, { id: clubId }, { authUserId }) =>
            updateTemplate({
                club: {
                    id: clubId,
                    payload: {
                        $pull: {
                            members: authUserId
                        }
                    }
                },
                user: {
                    id: authUserId,
                    payload: {
                        $pull: {
                            "clubs.member": clubId
                        }
                    }
                },
                check: {
                    arrName: MEMBERS,
                    shouldInclude: true,
                    err: NOT_A_MEMBER
                }
            })
    ),
    removeClubMember: combineResolvers(
        isAuthenticated,
        isClubManager,
        clearClubCache,
        (parent, { id: clubId, userId }) =>
            updateTemplate({
                club: {
                    id: clubId,
                    payload: {
                        $pull: {
                            members: userId
                        }
                    }
                },
                user: {
                    id: userId,
                    payload: {
                        $pull: {
                            "clubs.member": clubId
                        }
                    }
                },
                check: {
                    arrName: MEMBERS,
                    shouldInclude: true,
                    err: NOT_A_MEMBER
                }
            })
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
