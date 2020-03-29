const { seedDatabase, users } = require("./utils/seedDatabase");
const {
    createUser,
    login,
    getUsers,
    getMe,
    updateUser,
    deleteUser
} = require("./operations/userOperations");
const getClient = require("./utils/getClient");
const UserModel = require("../src/models/UserModel");

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

        const user = await UserModel.findOne({
            _id: data.createUser.user.id
        });

        expect(user.name).toEqual("User 3");
    });

    test("Should fail to create new user where username has been taken", async () => {
        const variables = {
            data: {
                name: "User 3",
                username: users[0].input,
                email: "email3@example.com",
                password: "hjsat367"
            }
        };

        await expect(
            client.mutate({
                mutation: createUser,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to create new user where email has been taken", async () => {
        const variables = {
            data: {
                name: "User 3",
                username: "user3",
                email: users[0].input.email,
                password: "hjsat367"
            }
        };

        await expect(
            client.mutate({
                mutation: createUser,
                variables
            })
        ).rejects.toThrow();
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

    test("Should fail to login with bad credentials", async () => {
        const variables = {
            username: "fakeusername",
            password: "djhfjkdsr3ywiueh"
        };

        await expect(
            client.mutate({
                mutation: login,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return logged in user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getMe
        });

        expect(data.me.id).toEqual(users[0].output.id);
    });

    test("Should return a list of users", async () => {
        const { data } = await client.query({
            query: getUsers
        });

        expect(data.users.length).toEqual(2);
    });

    test("Should only return emails for logged in users", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getUsers
        });

        expect(data.users[0].email).toEqual(users[0].input.email);
        expect(data.users[1].email).toEqual(null);
    });

    test("Should return one user by ID", async () => {
        const variables = {
            where: {
                id: users[1].output.id
            }
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should return one user by other property", async () => {
        const variables = {
            where: {
                name: users[1].input.name
            }
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should sort results", async () => {
        const variables = {
            sortBy: "name",
            sortOrder: "DESC"
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(2);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should limit results", async () => {
        const variables = {
            limit: 1
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[0].input.name);
    });

    test("Should skip results", async () => {
        const variables = {
            skip: 1
        };

        const { data } = await client.query({
            query: getUsers,
            variables
        });

        expect(data.users.length).toEqual(1);
        expect(data.users[0].name).toEqual(users[1].input.name);
    });

    test("Should update user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "User 1 updated",
                username: "user1updated"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateUser,
            variables
        });

        expect(data.updateUser.name).toEqual("User 1 updated");
        expect(data.updateUser.username).toEqual("user1updated");
    });

    test("Should update user", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "User 1 updated",
                username: "user1updated"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateUser,
            variables
        });

        expect(data.updateUser.name).toEqual("User 1 updated");
        expect(data.updateUser.username).toEqual("user1updated");
    });

    test("Should delete user", async () => {
        const authenticatedClient = getClient(users[0].token);

        await authenticatedClient.mutate({
            mutation: deleteUser
        });

        const user = await UserModel.findOne({
            _id: users[0].output.id
        });

        expect(user).toBe(null);
    });
});
