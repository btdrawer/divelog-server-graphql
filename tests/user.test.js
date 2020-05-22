const { UserModel } = require("@btdrawer/divelog-server-utils").models;
const { globalSetup, globalTeardown } = require("./utils/setup");
const { seedDatabase, users } = require("./utils/seedDatabase");
const {
    createUser,
    login,
    getUsers,
    getMe,
    getUser,
    updateUser,
    deleteUser
} = require("./operations/userOperations");
const getClient = require("./utils/getClient");

const client = getClient();
let authenticatedClient;

beforeAll(globalSetup);

describe("Users", () => {
    beforeEach(seedDatabase);

    describe("When not logged in", () => {
        describe("and using valid inputs", () => {
            test("should create new user", async () => {
                const variables = {
                    data: {
                        name: "User 5",
                        username: "user5",
                        email: "email5@example.com",
                        password: "hjsat367"
                    }
                };

                const { data } = await client.mutate({
                    mutation: createUser,
                    variables
                });

                expect(data.createUser.user.name).toEqual("User 5");
                expect(data.createUser.user.username).toEqual("user5");

                const user = await UserModel.findOne({
                    _id: data.createUser.user.id
                });

                expect(user.name).toEqual("User 5");
            });

            test("should successfully login", async () => {
                const variables = {
                    username: users[0].input.username,
                    password: users[0].input.password
                };

                const { data } = await client.mutate({
                    mutation: login,
                    variables
                });

                expect(data.login.user.name).toEqual(users[0].input.name);
                expect(data.login.user.username).toEqual(
                    users[0].input.username
                );
            });

            test("should return a list of users", async () => {
                const { data } = await client.query({
                    query: getUsers
                });

                expect(data.users.data.length).toEqual(4);
            });

            test("should only return emails for logged in users", async () => {
                const { data } = await client.query({
                    query: getUsers
                });

                data.users.data.forEach(({ email }) => {
                    expect(email).toEqual(null);
                });
            });

            test("should return one user by other property", async () => {
                const variables = {
                    where: {
                        name: users[1].input.name
                    }
                };

                const { data } = await client.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(1);
                expect(data.users.data[0].name).toEqual(users[1].input.name);
            });

            test("should sort results", async () => {
                const variables = {
                    sortBy: "name",
                    sortOrder: "DESC"
                };

                const { data } = await client.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(4);
                expect(data.users.data[0].name).toEqual(users[3].input.name);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 2
                };

                const { data } = await client.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(2);
                expect(data.users.data[0].name).toEqual(users[0].input.name);
            });

            test("should return user by ID", async () => {
                const variables = {
                    id: users[1].output.id
                };

                const { data } = await client.query({
                    query: getUser,
                    variables
                });

                expect(data.user.name).toEqual(users[1].input.name);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to create new user where username has been taken", async () => {
                const variables = {
                    data: {
                        name: "User 5",
                        username: users[0].input.username,
                        email: "email5@example.com",
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

            test("should fail to create new user where email has been taken", async () => {
                const variables = {
                    data: {
                        name: "User 5",
                        username: "user5",
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

            test("should fail to login with bad credentials", async () => {
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

            test("should fail to update user", async () => {
                const variables = {
                    data: {
                        username: "someUsernameThatHasntBeenTaken"
                    }
                };

                await expect(
                    client.mutate({
                        mutation: updateUser,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to update user", async () => {
                await expect(
                    client.mutate({
                        mutation: deleteUser
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When logged in", () => {
        beforeEach(() => {
            authenticatedClient = getClient(users[0].token);
        });

        describe("and using valid inputs", () => {
            test("should return a list of users", async () => {
                const { data } = await authenticatedClient.query({
                    query: getUsers
                });

                expect(data.users.data.length).toEqual(4);
            });

            test("should only return emails for logged in users", async () => {
                const { data } = await authenticatedClient.query({
                    query: getUsers
                });

                expect(data.users.data[0].email).toEqual(users[0].output.email);

                expect(data.users.data[1].email).toEqual(null);
                expect(data.users.data[2].email).toEqual(null);
                expect(data.users.data[3].email).toEqual(null);
            });

            test("should return one user by other property", async () => {
                const variables = {
                    where: {
                        name: users[1].input.name
                    }
                };

                const { data } = await authenticatedClient.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(1);
                expect(data.users.data[0].name).toEqual(users[1].input.name);
            });

            test("should sort results", async () => {
                const variables = {
                    sortBy: "name",
                    sortOrder: "DESC"
                };

                const { data } = await authenticatedClient.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(4);
                expect(data.users.data[0].name).toEqual(users[3].input.name);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 2
                };

                const { data } = await authenticatedClient.query({
                    query: getUsers,
                    variables
                });

                expect(data.users.data.length).toEqual(2);
                expect(data.users.data[0].name).toEqual(users[0].input.name);
            });

            test("should return user by ID", async () => {
                const variables = {
                    id: users[1].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getUser,
                    variables
                });

                expect(data.user.name).toEqual(users[1].input.name);
            });

            test("should return logged in user", async () => {
                const { data } = await authenticatedClient.query({
                    query: getMe
                });

                expect(data.me.id).toEqual(users[0].output.id);
            });

            test("should only return emails for logged in users", async () => {
                const { data } = await authenticatedClient.query({
                    query: getUsers
                });

                expect(data.users.data[0].email).toEqual(users[0].input.email);
                expect(data.users.data[1].email).toEqual(null);
            });

            test("should update user", async () => {
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

            test("should delete user", async () => {
                await authenticatedClient.mutate({
                    mutation: deleteUser
                });

                const user = await UserModel.findOne({
                    _id: users[0].output.id
                });

                expect(user).toBe(null);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to update username where username has been taken", async () => {
                const variables = {
                    data: {
                        username: users[0].input.username
                    }
                };

                await expect(
                    client.mutate({
                        mutation: updateUser,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to update user email where email has been taken", async () => {
                const variables = {
                    data: {
                        email: users[0].input.email
                    }
                };

                await expect(
                    client.mutate({
                        mutation: updateUser,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });
});

afterAll(globalTeardown);
