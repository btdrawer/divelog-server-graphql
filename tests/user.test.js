const { seedDatabase, users } = require("./utils/seedDatabase");
const { createUser } = require("./operations/userOperations");
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

        console.log(data);
        expect(true).toBe(true);
    });
});
