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

exports.batchUser = userIds =>
    genericBatch({
        model: UserModel,
        ids: userIds
    });

exports.batchDive = diveIds =>
    genericBatch({
        model: DiveModel,
        ids: diveIds
    });

exports.batchClub = clubIds =>
    genericBatch({
        model: ClubModel,
        ids: clubIds
    });

exports.batchGear = gearIds =>
    genericBatch({
        model: GearModel,
        ids: gearIds
    });
