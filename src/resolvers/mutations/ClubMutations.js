const ClubModel = require("../../models/ClubModel");
const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const clubMiddleware = require("../../authentication/middleware/clubMiddleware");
const { UPDATE, DELETE } = require("../../constants/methods");
const {
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER
} = require("../../constants/errorCodes");

const updateOperationTemplate = async ({
    clubId,
    data,
    request,
    removingManagers = false
}) => {
    await clubMiddleware({
        method: UPDATE,
        clubId,
        request,
        removingManagers
    });
    return ClubModel.findOneAndUpdate(
        {
            _id: clubId
        },
        data,
        { new: true }
    );
};

const updateClubManagersTemplate = async ({
    clubId,
    userId,
    request,
    action
}) => {
    const { managers: currentManagers } = await ClubModel.findOne({
        _id: clubId
    });
    if (action === "$push" && currentManagers.includes(userId)) {
        throw new Error(ALREADY_A_MANAGER);
    }
    if (action === "$pull" && !currentManagers.includes(userId)) {
        throw new Error(NOT_A_MANAGER);
    }
    const club = await updateOperationTemplate({
        clubId,
        data: {
            [action]: {
                managers: userId
            }
        },
        request,
        removingManagers: action === "$pull"
    });
    await UserModel.findOneAndUpdate(
        {
            _id: userId
        },
        {
            [action]: {
                "clubs.manager": club.id
            }
        }
    );
    return club;
};

const updateClubMembershipTemplate = async ({ clubId, userId, action }) => {
    const { members: currentMembers } = await ClubModel.findOne({
        _id: clubId
    });
    if (action === "$push" && currentMembers.includes(userId)) {
        throw new Error(ALREADY_A_MEMBER);
    }
    if (action === "$pull" && !currentMembers.includes(userId)) {
        throw new Error(NOT_A_MEMBER);
    }
    const club = await ClubModel.findOneAndUpdate(
        {
            _id: clubId
        },
        {
            [action]: {
                members: userId
            }
        },
        { new: true }
    );
    await UserModel.findOneAndUpdate(
        {
            _id: userId
        },
        {
            [action]: {
                "clubs.member": clubId
            }
        }
    );
    return club;
};

module.exports = {
    createClub: async (parent, { data }, { request }) => {
        const userId = getUserId(request);
        const club = new ClubModel({
            ...data,
            managers: [userId]
        });
        await club.save();
        await UserModel.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $push: {
                    "clubs.manager": club.id
                }
            }
        );
        return club;
    },
    updateClub: async (parent, { id, data }, { request }) =>
        updateOperationTemplate({
            clubId: id,
            data,
            request
        }),
    addClubManager: (parent, { clubId, userId }, { request }) =>
        updateClubManagersTemplate({
            clubId,
            userId,
            request,
            action: "$push"
        }),
    removeClubManager: async (parent, { clubId, managerId }, { request }) =>
        updateClubManagersTemplate({
            clubId,
            userId: managerId,
            request,
            action: "$pull"
        }),
    joinClub: (parent, { id }, { request }) => {
        const userId = getUserId(request);
        return updateClubMembershipTemplate({
            clubId: id,
            userId,
            action: "$push"
        });
    },
    leaveClub: (parent, { id }, { request }) => {
        const userId = getUserId(request);
        return updateClubMembershipTemplate({
            clubId: id,
            userId,
            action: "$pull"
        });
    },
    removeClubMember: async (parent, { clubId, memberId }, { request }) => {
        await clubMiddleware({
            method: UPDATE,
            clubId,
            request
        });
        return updateClubMembershipTemplate({
            clubId,
            userId: memberId,
            action: "$pull"
        });
    },
    deleteClub: async (parent, { id }, { request }) => {
        await clubMiddleware({
            method: DELETE,
            clubId: id,
            request
        });
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
        return ClubModel.findOneAndDelete({
            _id: id
        });
    }
};
