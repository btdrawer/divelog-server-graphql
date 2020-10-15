import { models } from "@btdrawer/divelog-server-utils";
import { UserTypeDef, GroupTypeDef, MessageTypeDef } from "../../types";
const { UserModel } = models;

/*
const getParticipants = (participants: UserTypeDef[]) =>
    UserModel.find({
        _id: {
            $in: participants
        }
    });

export const participants = getParticipants;

export const messages = async ({ participants, messages }: GroupTypeDef) => {
    const participantsDetails = await getParticipants(participants);
    const participantsDetailsReduced = participantsDetails.reduce(
        (acc, participant) => ({
            ...acc,
            [participant.id]: participant
        }),
        {}
    );
    const getKey = <T extends object, U extends keyof T>(obj: T, key: U) =>
        obj[key];
    return messages.map(({ id, text, sender }: MessageTypeDef) => ({
        id,
        text,
        sender: getKey(participantsDetailsReduced, sender.id)
    }));
};
*/
