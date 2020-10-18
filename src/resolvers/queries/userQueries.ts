import { combineResolvers } from "graphql-resolvers";
import { User } from "@btdrawer/divelog-server-core";
import { isAuthenticated } from "../middleware";
import { Context, FieldResolver } from "../../types";

export const users = (
    parent: any,
    args: any,
    { runListQuery }: Context
): Promise<FieldResolver> => runListQuery(User, args);

export const user = (parent: any, { id }: any) => User.get(id);

export const me = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId }: Context) => User.get(authUserId)
);
