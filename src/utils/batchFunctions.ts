import { Document } from "mongoose";
import { User, Dive, Club, Gear } from "@btdrawer/divelog-server-core";

const genericBatch = async (
    model: any,
    ids: readonly string[]
): Promise<Document[]> => {
    const result = await model.find({
        _id: {
            $in: ids
        }
    });
    return ids.map((id: string) =>
        result.find((doc: Document) => id === doc.id)
    );
};

export const batchUser = async (userIds: readonly string[]) =>
    genericBatch(User, userIds);

export const batchDive = async (diveIds: readonly string[]) =>
    genericBatch(Dive, diveIds);

export const batchClub = async (clubIds: readonly string[]) =>
    genericBatch(Club, clubIds);

export const batchGear = async (gearIds: readonly string[]) =>
    genericBatch(Gear, gearIds);
