import { skip } from "graphql-resolvers";
import { models, errorCodes } from "@btdrawer/divelog-server-utils";
import { Context, FieldResolver } from "../../types";
import {
    UserDocument,
    DiveDocument,
    ClubDocument,
    GearDocument,
    GroupDocument
} from "../../types";

const { ClubModel, DiveModel, GearModel, GroupModel } = models;
const { NOT_FOUND, FORBIDDEN } = errorCodes;

const hasAccess = (model: any, predicate: Function) => async (
    parent: any,
    { id }: any,
    { authUserId }: Context
): Promise<FieldResolver> => {
    const result = await model.findById(id);
    if (!result) {
        throw new Error(NOT_FOUND);
    }
    if (!predicate(result, authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return <any>skip;
};

export const isClubManager = hasAccess(
    ClubModel,
    (club: ClubDocument, authUserId: string) =>
        club.managers.some(({ id }: UserDocument) => id === authUserId)
);

export const isClubMember = hasAccess(
    ClubModel,
    (club: ClubDocument, authUserId: string) =>
        club.members.some(({ id }: UserDocument) => id === authUserId)
);

export const isDiveUser = hasAccess(
    DiveModel,
    (dive: DiveDocument, authUserId: string) =>
        dive.user.toString() === authUserId
);

export const isUserOrDiveIsPublic = hasAccess(
    DiveModel,
    (dive: DiveDocument, authUserId: string) =>
        dive.user.toString() === authUserId || dive.public
);

export const isGearOwner = hasAccess(
    GearModel,
    (gear: GearDocument, authUserId: string) =>
        gear.owner.toString() === authUserId
);

export const isGroupParticipant = hasAccess(
    GroupModel,
    (group: GroupDocument, authUserId: string) =>
        group.participants.some(({ id }: UserDocument) => id === authUserId)
);
