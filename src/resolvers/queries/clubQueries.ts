import { Club, resources } from "@btdrawer/divelog-server-core";
import { Context } from "../../types";

const { CLUB } = resources;

export const clubs = (parent: any, args: any, { runListQuery }: Context) =>
    runListQuery(Club, args, undefined, CLUB);

export const club = (parent: any, { id }: any) => Club.get(id);
