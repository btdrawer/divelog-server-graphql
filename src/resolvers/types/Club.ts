import { Context, ClubTypeDef } from "../../types";

export const managers = (
    { managers }: ClubTypeDef,
    args: any,
    { loaders }: Context
) => managers.map(manager => loaders.userLoader.load(manager.toString()));

export const members = (
    { members }: ClubTypeDef,
    args: any,
    { loaders }: Context
) => members.map(member => loaders.userLoader.load(member.toString()));
