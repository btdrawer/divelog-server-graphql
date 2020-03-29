const UserModel = require("../../src/models/UserModel");
const ClubModel = require("../../src/models/ClubModel");
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
    },
    {
        input: {
            name: "User 3",
            username: "user3",
            email: "user3@example.com",
            password: "hd8y78rw4y"
        },
        output: undefined
    }
];

const clubs = [
    {
        input: {
            name: "A",
            location: "B",
            description: "C",
            website: "example.com"
        },
        output: undefined
    },
    {
        input: {
            name: "X",
            location: "Y",
            description: "Z",
            website: "example.co.uk"
        },
        output: undefined
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

const saveUser = async index => {
    const user = new UserModel(users[index].input);
    await user.save();
    users[index].output = user;
    users[index].token = user.token;
    return user;
};

const saveClub = async (index, managerIds, memberIds) => {
    clubs[index].input.managers = managerIds;
    clubs[index].input.members = memberIds;
    const club = new ClubModel(clubs[index].input);
    await club.save();
    clubs[index].output = club;
    return club;
};

const saveGear = async (index, ownerId) => {
    gear[index].input.owner = ownerId;
    const savedGear = new GearModel(gear[index].input);
    await savedGear.save();
    gear[index].output = savedGear;
    return savedGear;
};

const seedDatabase = async ({ resources = {} } = {}) => {
    await UserModel.deleteMany();
    await ClubModel.deleteMany();

    // Example users
    await saveUser(0);
    await saveUser(1);
    await saveUser(2);

    // Example clubs
    if (resources.clubs) {
        await saveClub(0, [users[0].output.id], [users[1].output.id]);
        await saveClub(
            1,
            [users[1].output.id, users[2].output.id],
            [users[0].output.id]
        );
    }

    // Example gear
    if (resources.gear) {
        await saveGear(0, users[0].output.id);
        await saveGear(1, users[0].output.id);
    }
};

module.exports = {
    seedDatabase,
    users,
    clubs,
    gear
};
