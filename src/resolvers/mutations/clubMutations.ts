import { combineResolvers } from "graphql-resolvers";
import {
    UserDocument,
    getResourceId,
    Club,
    errorCodes
} from "@btdrawer/divelog-server-core";
import { Context } from "../../types";
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
const MANAGERS = "managers";
const MEMBERS = "members";

type Validation = {
    arrName: "managers" | "members";
    err: string;
    shouldInclude: boolean;
};

const checkArrayTemplate = async (
    clubId: string,
    userId: string,
    validation: Validation
) => {
    const club = await Club.get(clubId);
    if (!club) {
        throw new Error(NOT_FOUND);
    }
    const arr = club[validation.arrName];
    const result = arr.some(
        (user: UserDocument | string) => getResourceId(user) === userId
    );
    const predicate = validation.shouldInclude ? !result : result;
    if (predicate) {
        throw new Error(validation.err);
    }
    return undefined;
};

export const createClub = combineResolvers(
    isAuthenticated,
    clearClubCache,
    async (parent: any, { data }: any, { authUserId }: Context) =>
        Club.create({
            ...data,
            managers: [authUserId]
        })
);

export const updateClub = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    (parent: any, { id, data }: any) => Club.update(id, data)
);

export const addClubManager = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    async (parent: any, { id: clubId, userId }: any) => {
        await checkArrayTemplate(clubId, userId, {
            arrName: MANAGERS,
            shouldInclude: false,
            err: ALREADY_A_MANAGER
        });
        return Club.addManager(clubId, userId);
    }
);

export const removeClubManager = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    async (parent: any, { id: clubId, userId }: any) => {
        await checkArrayTemplate(clubId, userId, {
            arrName: MANAGERS,
            shouldInclude: true,
            err: NOT_A_MANAGER
        });
        return Club.removeManager(clubId, userId);
    }
);

export const joinClub = combineResolvers(
    isAuthenticated,
    clearClubCache,
    async (parent: any, { id: clubId }: any, { authUserId }: Context) => {
        await checkArrayTemplate(clubId, authUserId, {
            arrName: MEMBERS,
            shouldInclude: false,
            err: ALREADY_A_MEMBER
        });
        return Club.addMember(clubId, authUserId);
    }
);

export const leaveClub = combineResolvers(
    isAuthenticated,
    isClubMember,
    clearClubCache,
    async (parent: any, { id: clubId }: any, { authUserId }: Context) => {
        await checkArrayTemplate(clubId, authUserId, {
            arrName: MEMBERS,
            shouldInclude: true,
            err: NOT_A_MEMBER
        });
        return Club.removeMember(clubId, authUserId);
    }
);

export const removeClubMember = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    async (parent: any, { id: clubId, userId }: any) => {
        await checkArrayTemplate(clubId, userId, {
            arrName: MEMBERS,
            shouldInclude: true,
            err: NOT_A_MEMBER
        });
        return Club.removeMember(clubId, userId);
    }
);

export const deleteClub = combineResolvers(
    isAuthenticated,
    isClubManager,
    clearClubCache,
    async (parent: any, { id }: any) => Club.delete(id)
);
