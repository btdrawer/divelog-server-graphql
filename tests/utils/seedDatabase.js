const UserModel = require("../../src/models/UserModel");
const GearModel = require("../../src/models/GearModel");

require("../../src/db");

const users = [
    {
        input: {
            name: "User 1",
            username: "user1",
            email: "user1@example.com",
            password: "aafghd7675"
        },
        output: undefined,
        token: undefined
    },
    {
        input: {
            name: "User 2",
            username: "user2",
            email: "user2@example.com",
            password: "jhhd6625"
        },
        output: undefined,
        token: undefined
    }
];

const gear = [
    {
        input: {
            name: "A",
            brand: "A",
            model: "B",
            type: "C"
        },
        output: undefined
    },
    {
        input: {
            name: "X",
            brand: "Y",
            model: "Z",
            type: "W"
        },
        output: undefined
    }
];

const saveUser = async (users, index) => {
    const user = new UserModel(users[index].input);
    await user.save();
    users[index].output = user;
    users[index].token = user.token;
    return user;
};

const saveGear = async (gear, index, ownerId) => {
    gear[index].input.owner = ownerId;
    const savedGear = new GearModel(gear[index].input);
    await savedGear.save();
    gear[index].output = savedGear;
    return savedGear;
};

const seedDatabase = async () => {
    await UserModel.deleteMany();

    // Example users
    await saveUser(users, 0);
    await saveUser(users, 1);

    // Example gear
    await saveGear(gear, 0, users[0].output.id);
    await saveGear(gear, 1, users[0].output.id);
};

module.exports = {
    seedDatabase,
    users,
    gear
};
