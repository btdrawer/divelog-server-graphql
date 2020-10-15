import { models } from "@btdrawer/divelog-server-utils";

const { UserModel, DiveModel, ClubModel, GearModel, GroupModel } = models;

const users: {
    input: {
        name: string;
        username: string;
        email: string;
        password: string;
        managers?: string[];
        members?: string[];
    };
    output?: any;
    token?: string;
}[] = [
    {
        input: {
            name: "User 1",
            username: "user1",
            email: "user1@example.com",
            password: "aafghd7675"
        },
        output: {},
        token: undefined
    },
    {
        input: {
            name: "User 2",
            username: "user2",
            email: "user2@example.com",
            password: "jhhd6625"
        },
        output: {},
        token: undefined
    },
    {
        input: {
            name: "User 3",
            username: "user3",
            email: "user3@example.com",
            password: "hd8y78rw4y"
        },
        output: {}
    },
    {
        input: {
            name: "User 4",
            username: "user4",
            email: "user4@example.com",
            password: "hjkfdshds787"
        },
        output: {}
    }
];

const dives: {
    input: {
        timeIn: string;
        timeOut: string;
        bottomTime: number;
        safetyStopTime: number;
        maxDepth: number;
        location: string;
        description: string;
        public: boolean;
        user?: string;
        club?: string;
        buddies?: string[];
        gear?: string[];
    };
    output?: any;
}[] = [
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
        output: {}
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
            public: true
        },
        output: {}
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
        output: {}
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
            public: false
        },
        output: {}
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
        output: {}
    }
];

const clubs: {
    input: {
        name: string;
        location: string;
        website: string;
        managers?: any;
        members?: any;
    };
    output?: any;
}[] = [
    {
        input: {
            name: "A",
            location: "B",
            website: "example.com"
        },
        output: {}
    },
    {
        input: {
            name: "X",
            location: "Y",
            website: "example.co.uk"
        },
        output: {}
    }
];

const gear: {
    input: {
        name: string;
        brand: string;
        model: string;
        type: string;
        owner?: string;
    };
    output?: any;
}[] = [
    {
        input: {
            name: "A",
            brand: "A",
            model: "B",
            type: "C"
        },
        output: {}
    },
    {
        input: {
            name: "X",
            brand: "Y",
            model: "Z",
            type: "W"
        },
        output: {}
    },
    {
        input: {
            name: "X",
            brand: "Y",
            model: "Z",
            type: "W"
        },
        output: {}
    }
];

const groups: {
    input: {
        name: string;
        messages: {
            text: string;
            sender?: string;
        }[];
        participants?: string[];
    };
    output?: any;
}[] = [
    {
        input: {
            name: "New Group",
            messages: [
                {
                    text: "Hi"
                }
            ]
        },
        output: {}
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
        output: {}
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
        output: {}
    }
];

const saveUser = async (index: number) => {
    const user = new UserModel(users[index].input);
    await user.save();
    users[index].output = user;
    users[index].token = user.token;
    return user;
};

const saveClub = async (
    index: number,
    managerIds: string[],
    memberIds: string[]
) => {
    clubs[index].input.managers = managerIds;
    clubs[index].input.members = memberIds;
    const club = new ClubModel(clubs[index].input);
    await club.save();
    clubs[index].output = club;
    return club;
};

const saveGear = async (index: number, ownerId: string) => {
    gear[index].input.owner = ownerId;
    const savedGear = new GearModel(gear[index].input);
    await savedGear.save();
    gear[index].output = savedGear;
    return savedGear;
};

const saveDive = async (
    index: number,
    userId: string,
    clubId: string | undefined,
    buddyIds: string[],
    gearIds: string[]
) => {
    dives[index].input.user = userId;
    dives[index].input.club = clubId;
    dives[index].input.buddies = buddyIds;
    dives[index].input.gear = gearIds;

    const dive = new DiveModel(dives[index].input);
    await dive.save();
    dives[index].output = dive;
    return dive;
};

const saveGroup = async (index: number, myId: string, userIds: string[]) => {
    groups[index].input.participants = userIds;
    groups[index].input.messages[0].sender = myId;

    const group = new GroupModel(groups[index].input);
    await group.save();
    groups[index].output = group;
    return group;
};

const seedDatabase = async (resources: {
    users?: any;
    dives?: any;
    clubs?: any;
    gear?: any;
    groups?: any;
}) => {
    await UserModel.deleteMany({});
    await ClubModel.deleteMany({});

    // Example users
    await saveUser(0);
    await saveUser(1);
    await saveUser(2);
    await saveUser(3);

    // Example clubs
    if (resources.clubs) {
        await saveClub(
            0,
            [users[0].output.id, users[2].output.id],
            [users[1].output.id]
        );
        await saveClub(1, [users[2].output.id], [users[0].output.id]);
    }

    // Example gear
    if (resources.gear) {
        await saveGear(0, users[0].output.id);
        await saveGear(1, users[0].output.id);
        await saveGear(2, users[1].output.id);
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
            users[1].output.id,
            undefined,
            [users[0].output.id],
            [gear[0].output.id, gear[1].output.id]
        );
        await saveDive(2, users[0].output.id, undefined, [], []);
        await saveDive(3, users[1].output.id, undefined, [], []);
        await saveDive(4, users[1].output.id, undefined, [], []);
    }

    // Example groups
    if (resources.groups) {
        await saveGroup(0, users[0].output.id, [
            users[0].output.id,
            users[1].output.id
        ]);
        await saveGroup(1, users[1].output.id, [
            users[1].output.id,
            users[2].output.id
        ]);
        await saveGroup(2, users[0].output.id, [
            users[0].output.id,
            users[1].output.id
        ]);
    }

    console.log("clubs", clubs);
};

export { seedDatabase, users, dives, clubs, gear, groups };
