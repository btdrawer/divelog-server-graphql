import { getResourceId, User } from "@btdrawer/divelog-server-core";
import { UserTypeDef, GroupTypeDef, UserDocument } from "../../types";

const getParticipants = (participants: UserTypeDef[]) =>
    User.find({
        _id: {
            $in: participants
        }
    });

export const participants = async ({ participants }: GroupTypeDef) =>
    getParticipants(participants);

export const messages = async ({ participants, messages }: GroupTypeDef) => {
    const participantsDetails = await getParticipants(participants);
    return messages.map(({ id, text, sender }: any) => ({
        id,
        text,
        sender: participantsDetails.find(
            (participant: UserDocument | string) =>
                getResourceId(participant).toString() === sender.toString()
        )
    }));
};
