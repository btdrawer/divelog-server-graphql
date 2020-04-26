const { seedDatabase, users, groups } = require("./utils/seedDatabase");
const {
    createGroup,
    getMyGroups,
    getGroup,
    renameGroup,
    sendMessage,
    addGroupParticipant,
    leaveGroup
} = require("./operations/groupOperations");
const getClient = require("./utils/getClient");
const GroupModel = require("../src/models/GroupModel");

const client = getClient();
let authenticatedClient;

describe("Groups", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    groups: true
                }
            })
    );

    describe("When logged in", () => {
        beforeEach(() => {
            authenticatedClient = getClient(users[0].token);
        });

        describe("and using valid inputs", () => {
            test("should create a new group", async () => {
                const variables = {
                    data: {
                        name: "New Group 1",
                        participants: [users[1].output.id],
                        text: "Hello"
                    }
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: createGroup,
                    variables
                });

                expect(data.createGroup.name).toEqual("New Group 1");
                expect(data.createGroup.participants.length).toEqual(2);
                expect(data.createGroup.messages.length).toEqual(1);
                expect(data.createGroup.messages[0].sender.id).toEqual(
                    users[0].output.id
                );

                const groupInDatabase = await GroupModel.findOne({
                    _id: data.createGroup.id
                });

                expect(groupInDatabase.name).toEqual("New Group 1");
            });

            test("should return a list of groups the authenticated user belongs to", async () => {
                const { data } = await authenticatedClient.query({
                    query: getMyGroups
                });

                expect(data.myGroups.data.length).toEqual(2);
                expect(data.myGroups.data[0].id).toEqual(groups[0].output.id);
            });

            test("should get group by ID", async () => {
                const variables = {
                    id: groups[0].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getGroup,
                    variables
                });

                expect(data.group.id).toEqual(groups[0].output.id);
            });

            test("should filter groups by name", async () => {
                const variables = {
                    where: {
                        name: groups[2].output.name
                    }
                };

                const { data } = await authenticatedClient.query({
                    query: getMyGroups,
                    variables
                });

                expect(data.myGroups.data.length).toEqual(1);
                expect(data.myGroups.data[0].id).toEqual(groups[2].output.id);
                expect(data.myGroups.data[0].name).toEqual(
                    groups[2].output.name
                );
            });

            test("should sort results", async () => {
                const variables = {
                    sortBy: "name",
                    sortOrder: "DESC"
                };

                const { data } = await authenticatedClient.query({
                    query: getMyGroups,
                    variables
                });

                expect(data.myGroups.data.length).toEqual(2);
                expect(data.myGroups.data[0].id).toEqual(groups[2].output.id);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 1
                };

                const { data } = await authenticatedClient.query({
                    query: getMyGroups,
                    variables
                });

                expect(data.myGroups.data.length).toEqual(1);
                expect(data.myGroups.data[0].id).toEqual(groups[0].output.id);
            });

            test("should return next page", async () => {
                const requestOneVariables = {
                    limit: 1
                };

                const {
                    data: requestOneData
                } = await authenticatedClient.query({
                    query: getMyGroups,
                    variables: requestOneVariables
                });

                const { cursor } = requestOneData.myGroups.pageInfo;

                const requestTwoVariables = {
                    cursor
                };

                const {
                    data: requestTwoData
                } = await authenticatedClient.query({
                    query: getMyGroups,
                    variables: requestTwoVariables
                });

                expect(requestTwoData.myGroups.data.length).toEqual(1);
                expect(requestTwoData.myGroups.data[0].id).toEqual(
                    groups[2].output.id
                );
            });

            test("should rename group", async () => {
                const variables = {
                    id: groups[0].output.id,
                    name: "Updated group name"
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: renameGroup,
                    variables
                });

                expect(data.renameGroup.name).toEqual("Updated group name");
            });

            test("should send message", async () => {
                const variables = {
                    id: groups[0].output.id,
                    text: "New message"
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: sendMessage,
                    variables
                });

                expect(data.sendMessage.messages.length).toEqual(2);
                expect(data.sendMessage.messages[1].text).toEqual(
                    "New message"
                );
                expect(data.sendMessage.messages[1].sender.id).toEqual(
                    users[0].output.id
                );
            });

            test("should add group participant", async () => {
                const variables = {
                    id: groups[0].output.id,
                    userId: users[2].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: addGroupParticipant,
                    variables
                });

                expect(data.addGroupParticipant.participants.length).toEqual(3);
                expect(data.addGroupParticipant.participants[2].id).toEqual(
                    users[2].output.id
                );
            });

            test("should leave group", async () => {
                const variables = {
                    id: groups[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: leaveGroup,
                    variables
                });

                expect(data.leaveGroup.participants.length).toEqual(1);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to create new group if name is not supplied", async () => {
                const variables = {
                    data: {
                        participants: [users[1].output.id],
                        text: "Hello"
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: createGroup,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to create new group if participants are not supplied", async () => {
                const variables = {
                    data: {
                        name: "New Group 1",
                        text: "Hello"
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: createGroup,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to create new group if initial message text is not supplied", async () => {
                const variables = {
                    data: {
                        name: "New Group 1",
                        participants: [users[1].output.id]
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: createGroup,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to get group by ID that the user does not belong to", async () => {
                const variables = {
                    id: groups[1].output.id
                };

                await expect(
                    authenticatedClient.query({
                        query: getGroup,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to rename group if not a member", async () => {
                const variables = {
                    id: groups[1].output.id,
                    name: "Updated group name"
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: renameGroup,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to send message if not a member", async () => {
                const variables = {
                    id: groups[1].output.id,
                    text: "New message"
                };

                await expect(
                    authenticatedClient.mutate({
                        mutate: sendMessage,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add group participant if not a member", async () => {
                const variables = {
                    id: groups[1].output.id,
                    userId: users[3].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutate: addGroupParticipant,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to leave group if not a member", async () => {
                const variables = {
                    id: groups[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutate: leaveGroup,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When not logged in", () => {
        test("should fail to create a new group", async () => {
            const variables = {
                data: {
                    name: "New Group 1",
                    participants: [users[1].output.id],
                    text: "Hello"
                }
            };

            await expect(
                client.mutate({
                    mutation: createGroup,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail list all groups the user is a member of", async () => {
            const variables = {
                id: groups[0].output.id
            };

            await expect(
                client.query({
                    query: getMyGroups,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to get group by ID", async () => {
            const variables = {
                id: groups[0].output.id
            };

            await expect(
                client.query({
                    query: getGroup,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to rename group", async () => {
            const variables = {
                id: groups[0].output.id,
                name: "Updated group name"
            };

            await expect(
                client.mutate({
                    mutation: renameGroup,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to send message", async () => {
            const variables = {
                id: groups[0].output.id,
                text: "New message"
            };

            await expect(
                client.mutate({
                    mutation: sendMessage,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to add group participant", async () => {
            const variables = {
                id: groups[1].output.id,
                userId: users[3].output.id
            };

            await expect(
                client.mutate({
                    mutation: addGroupParticipant,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to leave group", async () => {
            const variables = {
                id: groups[0].output.id
            };

            await expect(
                client.mutate({
                    mutation: leaveGroup,
                    variables
                })
            ).rejects.toThrow();
        });
    });
});
