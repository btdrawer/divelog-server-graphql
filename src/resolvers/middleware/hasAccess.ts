import { skip } from "graphql-resolvers";
import {
    getResourceId,
    Club,
    Dive,
    Gear,
    Group,
    errorCodes
} from "@btdrawer/divelog-server-core";
import { Context, FieldResolver } from "../../types";
import {
    UserDocument,
    DiveDocument,
    ClubDocument,
    GearDocument,
    GroupDocument
} from "../../types";

const { NOT_FOUND, FORBIDDEN } = errorCodes;

const hasAccess = (model: any, predicate: Function) => async (
    parent: any,
    { id }: any,
    { authUserId }: Context
): Promise<FieldResolver> => {
    const result = await model.get(id);
    if (!result) {
        throw new Error(NOT_FOUND);
    }
    if (!predicate(result, authUserId)) {
        throw new Error(FORBIDDEN);
    }
    return <any>skip;
};

export const isClubManager = hasAccess(
    Club,
    (club: ClubDocument, authUserId: string) =>
        club.managers.some(
            (user: UserDocument | string) => getResourceId(user) === authUserId
        )
);

export const isClubMember = hasAccess(
    Club,
    (club: ClubDocument, authUserId: string) =>
        club.members.some(
            (user: UserDocument | string) => getResourceId(user) === authUserId
        )
);

export const isDiveUser = hasAccess(
    Dive,
    (dive: DiveDocument, authUserId: string) =>
        dive.user.toString() === authUserId
);

export const isUserOrDiveIsPublic = hasAccess(
    Dive,
    (dive: DiveDocument, authUserId: string) =>
        dive.user.toString() === authUserId || dive.public
);

export const isGearOwner = hasAccess(
    Gear,
    (gear: GearDocument, authUserId: string) =>
        gear.owner.toString() === authUserId
);

export const isGroupParticipant = hasAccess(
    Group,
    (group: GroupDocument, authUserId: string) =>
        group.participants.some(
            (user: UserDocument | string) => getResourceId(user) === authUserId
        )
);
