const { seedDatabase, users } = require("./utils/seedDatabase");
const { createUser, login } = require("./operations/userOperations");
const getClient = require("./utils/getClient");

const client = getClient();

describe("Users", () => {
    beforeEach(seedDatabase);

    test("Should create new user", async () => {
        const variables = {
            data: {
                name: "User 3",
                username: "user3",
                email: "email3@example.com",
                password: "hjsat367"
            }
        };

        const { data } = await client.mutate({
            mutation: createUser,
            variables
        });

        expect(data.createUser.user.name).toEqual("User 3");
        expect(data.createUser.user.username).toEqual("user3");
    });

    test("Should successfully login", async () => {
        const variables = {
            username: users[0].input.username,
            password: users[0].input.password
        };

        const { data } = await client.mutate({
            mutation: login,
            variables
        });

        expect(data.login.user.name).toEqual(users[0].input.name);
        expect(data.login.user.username).toEqual(users[0].input.username);
    });
});
