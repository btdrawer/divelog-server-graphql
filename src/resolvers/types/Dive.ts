import { getResourceId } from "@btdrawer/divelog-server-core";
import { Context, DiveTypeDef } from "../../types";

export const club = ({ club }: DiveTypeDef, args: any, { loaders }: Context) =>
    club ? loaders.clubLoader.load(club.toString()) : null;

export const user = ({ user }: DiveTypeDef, args: any, { loaders }: Context) =>
    loaders.userLoader.load(user.toString());

export const buddies = (
    { buddies }: DiveTypeDef,
    args: any,
    { loaders }: Context
) => buddies.map(buddy => loaders.userLoader.load(buddy.toString()));

export const gear = ({ gear }: DiveTypeDef, args: any, { loaders }: Context) =>
    gear.map(gearId => loaders.gearLoader.load(gearId.toString()));
