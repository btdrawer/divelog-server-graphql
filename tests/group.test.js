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

describe("Groups", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    groups: true
                }
            })
    );

    test("Should create a new group", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to create a new group if not logged in", async () => {
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

    test("Should return a list of groups the authenticated user belongs to", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getMyGroups
        });

        expect(data.myGroups.data.length).toEqual(3);
        expect(data.myGroups.data[0].id).toEqual(groups[0].output.id);
    });

    test("Should get group by ID", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: groups[0].output.id
        };

        const { data } = await authenticatedClient.query({
            query: getGroup,
            variables
        });

        expect(data.group.id).toEqual(groups[0].output.id);
    });

    test("Should filter groups by name", async () => {
        const authenticatedClient = getClient(users[0].token);

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
        expect(data.myGroups.data[0].name).toEqual(groups[2].output.name);
    });

    test("Should sort results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            sortBy: "name",
            sortOrder: "DESC"
        };

        const { data } = await authenticatedClient.query({
            query: getMyGroups,
            variables
        });

        expect(data.myGroups.data.length).toEqual(3);
        expect(data.myGroups.data[0].id).toEqual(groups[2].output.id);
    });

    test("Should limit results", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            limit: 2
        };

        const { data } = await authenticatedClient.query({
            query: getMyGroups,
            variables
        });

        expect(data.myGroups.data.length).toEqual(2);
        expect(data.myGroups.data[0].id).toEqual(groups[0].output.id);
    });

    test("Should rename group", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to rename group if not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: groups[0].output.id,
            name: "Updated group name"
        };

        await expect(
            authenticatedClient.mutate({
                mutation: renameGroup,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to rename group if not logged in", async () => {
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

    test("Should send message", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: groups[0].output.id,
            text: "New message"
        };

        const { data } = await authenticatedClient.mutate({
            mutation: sendMessage,
            variables
        });

        expect(data.sendMessage.messages.length).toEqual(2);
        expect(data.sendMessage.messages[1].text).toEqual("New message");
        expect(data.sendMessage.messages[1].sender.id).toEqual(
            users[0].output.id
        );
    });

    test("Should fail to send message if not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: groups[0].output.id,
            text: "New message"
        };

        await expect(
            authenticatedClient.mutate({
                mutate: sendMessage,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to send message if not logged in", async () => {
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

    test("Should add group participant", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to add group participant if not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: groups[0].output.id,
            userId: users[2].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutate: addGroupParticipant,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add group participant if not logged in", async () => {
        const variables = {
            id: groups[0].output.id,
            userId: users[2].output.id
        };

        await expect(
            client.mutate({
                mutation: addGroupParticipant,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should leave group", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: groups[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: leaveGroup,
            variables
        });

        expect(data.leaveGroup.participants.length).toEqual(1);
    });

    test("Should fail to leave group if not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

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

    test("Should fail to add group participant if not logged in", async () => {
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
