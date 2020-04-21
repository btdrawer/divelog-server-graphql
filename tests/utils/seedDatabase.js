const UserModel = require("../../src/models/UserModel");
const DiveModel = require("../../src/models/DiveModel");
const ClubModel = require("../../src/models/ClubModel");
const GearModel = require("../../src/models/GearModel");
const GroupModel = require("../../src/models/GroupModel");

const redisClient = require("../../src/services/redisClient");
const { CLUB } = require("../../src/constants/resources");

require("../../src/services/db");

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

const dives = [
    {
        input: {
            timeIn: "2020-01-01T11:00:00",
            timeOut: "2020-01-01T11:25:00",
            bottomTime: 22.0,
            safetyStopTime: 3.0,
            maxDepth: 17.3,
            location: "Sample location",
            description: "Dive description",
            public: true
        },
        output: undefined
    },
    {
        input: {
            timeIn: "2020-01-02T11:00:00",
            timeOut: "2020-01-02T11:22:00",
            bottomTime: 19.0,
            safetyStopTime: 3.0,
            maxDepth: 15.5,
            location: "Sample location",
            description: "Dive description",
            public: false
        },
        output: undefined
    },
    {
        input: {
            timeIn: "2020-01-03T11:00:00",
            timeOut: "2020-01-03T11:22:00",
            bottomTime: 19.0,
            safetyStopTime: 3.0,
            maxDepth: 15.9,
            location: "Sample location 2",
            description: "Dive description 2",
            public: true
        },
        output: undefined
    }
];

const clubs = [
    {
        input: {
            name: "A",
            location: "B",
            website: "example.com"
        },
        output: undefined
    },
    {
        input: {
            name: "X",
            location: "Y",
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

const groups = [
    {
        input: {
            name: "New Group",
            messages: [
                {
                    text: "Hi"
                }
            ]
        },
        output: undefined
    },
    {
        input: {
            name: "New Group 2",
            messages: [
                {
                    text: "Hi"
                }
            ]
        },
        output: undefined
    },
    {
        input: {
            name: "New Group 3",
            messages: [
                {
                    text: "Hi"
                }
            ]
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

const saveDive = async (index, userId, clubId, buddyIds, gearIds) => {
    dives[index].input.user = userId;
    dives[index].input.club = clubId;
    dives[index].input.buddies = buddyIds;
    dives[index].input.gear = gearIds;

    const dive = new DiveModel(dives[index].input);
    await dive.save();
    dives[index].output = dive;
    return dive;
};

const saveGroup = async (index, myId, userIds) => {
    groups[index].input.participants = userIds;
    groups[index].input.messages[0].sender = myId;

    const group = new GroupModel(groups[index].input);
    await group.save();
    groups[index].output = group;
    return group;
};

const seedDatabase = async ({ resources = {} } = {}) => {
    await UserModel.deleteMany();
    await ClubModel.deleteMany();

    // Because the `club` key is always the same, cached data will cause
    // problems for tests run sequentially with newly-seeded data
    redisClient.del(CLUB);

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

    // Example dives
    if (resources.dives) {
        await saveDive(
            0,
            users[0].output.id,
            clubs[0].output.id,
            [users[1].output.id],
            [gear[0].output.id]
        );
        await saveDive(
            1,
            users[0].output.id,
            null,
            [users[1].output.id, users[2].output.id],
            [gear[0].output.id, gear[1].output.id]
        );
        await saveDive(2, users[0].output.id, null, [], []);
    }

    // Example groups
    if (resources.groups) {
        await saveGroup(0, users[0].output.id, [
            users[0].output.id,
            users[1].output.id
        ]);
        await saveGroup(1, users[0].output.id, [
            users[0].output.id,
            users[1].output.id
        ]);
        await saveGroup(2, users[0].output.id, [
            users[0].output.id,
            users[1].output.id
        ]);
    }
};

module.exports = {
    seedDatabase,
    users,
    dives,
    clubs,
    gear,
    groups
};
