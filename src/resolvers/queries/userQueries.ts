import { combineResolvers } from "graphql-resolvers";
import { models } from "@btdrawer/divelog-server-utils";
import { isAuthenticated } from "../middleware";
import { Context, FieldResolver } from "../../types";

const { UserModel } = models;

export const users = (
    parent: any,
    args: any,
    { runListQuery }: Context
): Promise<FieldResolver> =>
    runListQuery({
        model: UserModel,
        args
    });

export const user = (parent: any, { id }: any) => UserModel.findById(id);

export const me = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId }: Context) =>
        UserModel.findById(authUserId)
);
