import { User } from "@btdrawer/divelog-server-core";
import {
    UserTypeDef,
    GroupTypeDef,
    MessageTypeDef,
    UserDocument
} from "../../types";

const getParticipants = (participants: UserTypeDef[]) =>
    User.find({
        _id: {
            $in: participants
        }
    });

export const participants = getParticipants;

export const messages = async ({ participants, messages }: GroupTypeDef) => {
    const participantsDetails = await getParticipants(participants);
    const participantsDetailsReduced = participantsDetails.reduce(
        (acc: any, participant: UserDocument) => ({
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
