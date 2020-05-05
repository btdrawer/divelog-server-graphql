const {
    UserModel,
    DiveModel,
    ClubModel,
    GearModel
} = require("@btdrawer/divelog-server-utils").models;

const genericBatch = async ({ model, ids }) => {
    const result = await model.find({
        _id: {
            $in: ids
        }
    });
    return ids.map(id => result.find(({ id: resultId }) => id === resultId));
};

exports.batchUser = async userIds =>
    await genericBatch({
        model: UserModel,
        ids: userIds
    });

exports.batchDive = async diveIds =>
    await genericBatch({
        model: DiveModel,
        ids: diveIds
    });

exports.batchClub = async clubIds =>
    await genericBatch({
        model: ClubModel,
        ids: clubIds
    });

exports.batchGear = async gearIds =>
    await genericBatch({
        model: GearModel,
        ids: gearIds
    });
