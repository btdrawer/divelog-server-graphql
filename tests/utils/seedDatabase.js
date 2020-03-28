const UserModel = require("../../src/models/UserModel");
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

const saveUser = async (users, index) => {
    const user = new UserModel(users[index].input);
    await user.save();
    users[index].output = user;
    users[index].token = user.token;
    return user;
};

const seedDatabase = async () => {
    await UserModel.deleteMany();
    await Promise.all([saveUser(users, 0), saveUser(users, 1)]);
};

module.exports = {
    seedDatabase,
    users
};
