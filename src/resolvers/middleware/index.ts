import { skip } from "graphql-resolvers";
import { resources, errorCodes } from "@btdrawer/divelog-server-core";
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
    { authUserId, clearCache }: Context
): Promise<undefined> => {
    clearCache(generateUserHashKey(authUserId));
    return skip;
};

export const clearClubCache = async (
    parent: any,
    args: any,
    { clearCache }: Context
): Promise<undefined> => {
    clearCache(CLUB);
    return skip;
};

export const clearGroupCache = async (
    parent: any,
    { id }: any,
    { clearCache }: Context
): Promise<undefined> => {
    clearCache(generateGroupHashKey(id));
    return skip;
};

export * from "./hasAccess";
