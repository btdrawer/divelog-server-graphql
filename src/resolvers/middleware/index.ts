import { skip } from "graphql-resolvers";
import { resources, errorCodes } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";
import { generateUserHashKey, generateGroupHashKey } from "../../utils";

const { CLUB } = resources;
const { INVALID_AUTH } = errorCodes;

export const isAuthenticated = async (
    parent: any,
    args: any,
    { authUserId }: Context
): Promise<undefined> => {
    if (!authUserId) {
        throw new Error(INVALID_AUTH);
    }
    return skip;
};

export const clearUserCache = async (
    parent: any,
    args: any,
    { authUserId, cacheUtils }: Context
): Promise<undefined> => {
    cacheUtils.clearCache(generateUserHashKey(<string>authUserId));
    return skip;
};

export const clearClubCache = async (
    parent: any,
    args: any,
    { cacheUtils }: Context
): Promise<undefined> => {
    cacheUtils.clearCache(CLUB);
    return skip;
};

export const clearGroupCache = async (
    parent: any,
    { id }: any,
    { cacheUtils }: Context
): Promise<undefined> => {
    cacheUtils.clearCache(generateGroupHashKey(id));
    return skip;
};

export * from "./hasAccess";
