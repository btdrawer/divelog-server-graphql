import { Document } from "mongoose";
import { models } from "@btdrawer/divelog-server-utils";
const { UserModel, DiveModel, ClubModel, GearModel } = models;

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
    genericBatch(UserModel, userIds);

export const batchDive = async (diveIds: readonly string[]) =>
    genericBatch(DiveModel, diveIds);

export const batchClub = async (clubIds: readonly string[]) =>
    genericBatch(ClubModel, clubIds);

export const batchGear = async (gearIds: readonly string[]) =>
    genericBatch(GearModel, gearIds);
