import { models, resources } from "@btdrawer/divelog-server-utils";
import { Context } from "../../types";

const { ClubModel } = models;
const { CLUB } = resources;

export const clubs = (parent: any, args: any, { runListQuery }: Context) =>
    runListQuery({
        model: ClubModel,
        args,
        hashKey: CLUB
    });

export const club = (parent: any, { id }: any) => ClubModel.findById(id);
