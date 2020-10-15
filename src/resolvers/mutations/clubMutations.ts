import { combineResolvers } from "graphql-resolvers";
import { models, errorCodes } from "@btdrawer/divelog-server-utils";
import { Context, UserDocument } from "../../types";
import {
    isAuthenticated,
    clearClubCache,
    isClubManager,
    isClubMember
} from "../middleware";

const {
    ALREADY_A_MANAGER,
    NOT_A_MANAGER,
    ALREADY_A_MEMBER,
    NOT_A_MEMBER,
    NOT_FOUND
} = errorCodes;
const { ClubModel, UserModel } = models;

const MANAGERS = "managers";
const MEMBERS = "members";

type Validation = {
    arrName: "managers" | "members";
    err: string;
    shouldInclude: boolean;
};

type UpdateInfo = {
    id: string;
    payload: any;
};

const checkArrayTemplate = async (
    clubId: string,
    userId: string,
    validation: Validation
) => {
    const club = await ClubModel.findById(clubId);
    if (!club) {
        throw new Error(NOT_FOUND);
    }
    const arr: UserDocument[] = club[validation.arrName];
    const result = arr.some(user => user.id === userId);
    const predicate = validation.shouldInclude ? !result : result;
    if (predicate) {
        throw new Error(validation.err);
    }
    return undefined;
};

const updateTemplate = async (
    club: UpdateInfo,
    user: UpdateInfo,
    validation: Validation
) => {
    await checkArrayTemplate(club.id, user.id, validation);
    const updatedClub = await ClubModel.findByIdAndUpdate(
        club.id,
        club.payload,
        { new: true }
    );
    await UserModel.findByIdAndUpdate(user.id, user.payload);
    return updatedClub;
};

export const createClub = combineResolvers(
    isAuthenticated,
    clearClubCache,
    async (parent: any, { data }: any, { authUserId }: Context) => {
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
);

export const updateClub = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    (parent: any, { id, data }: any) =>
        ClubModel.findByIdAndUpdate(id, data, { new: true })
);

export const addClubManager = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    (parent: any, { id: clubId, userId }: any) =>
        updateTemplate(
            {
                id: clubId,
                payload: {
                    $push: {
                        managers: userId
                    }
                }
            },
            {
                id: userId,
                payload: {
                    $push: {
                        "clubs.manager": clubId
                    }
                }
            },
            {
                arrName: MANAGERS,
                shouldInclude: false,
                err: ALREADY_A_MANAGER
            }
        )
);

export const removeClubManager = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    (parent: any, { id: clubId, userId }: any) =>
        updateTemplate(
            {
                id: clubId,
                payload: {
                    $pull: {
                        managers: userId
                    }
                }
            },
            {
                id: userId,
                payload: {
                    $pull: {
                        "clubs.manager": clubId
                    }
                }
            },
            {
                arrName: MANAGERS,
                shouldInclude: true,
                err: NOT_A_MANAGER
            }
        )
);

export const joinClub = combineResolvers(
    isAuthenticated,
    clearClubCache,
    (parent: any, { id: clubId }: any, { authUserId }: Context) =>
        updateTemplate(
            {
                id: clubId,
                payload: {
                    $push: {
                        members: authUserId
                    }
                }
            },
            {
                id: <string>authUserId,
                payload: {
                    $push: {
                        "clubs.member": clubId
                    }
                }
            },
            {
                arrName: MEMBERS,
                shouldInclude: false,
                err: ALREADY_A_MEMBER
            }
        )
);

export const leaveClub = combineResolvers(
    isAuthenticated,
    isClubMember,
    clearClubCache,
    (parent: any, { id: clubId }: any, { authUserId }: Context) =>
        updateTemplate(
            {
                id: clubId,
                payload: {
                    $pull: {
                        members: authUserId
                    }
                }
            },
            {
                id: <string>authUserId,
                payload: {
                    $pull: {
                        "clubs.member": clubId
                    }
                }
            },
            {
                arrName: MEMBERS,
                shouldInclude: true,
                err: NOT_A_MEMBER
            }
        )
);

export const removeClubMember = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    (parent: any, { id: clubId, userId }: any) =>
        updateTemplate(
            {
                id: clubId,
                payload: {
                    $pull: {
                        members: userId
                    }
                }
            },
            {
                id: userId,
                payload: {
                    $pull: {
                        "clubs.member": clubId
                    }
                }
            },
            {
                arrName: MEMBERS,
                shouldInclude: true,
                err: NOT_A_MEMBER
            }
        )
);

export const deleteClub = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    async (parent: any, { id }: any) => {
        await UserModel.updateMany(
            {
                $in: {
                    "clubs.manager": id
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
                $in: {
                    "clubs.member": id
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
);
