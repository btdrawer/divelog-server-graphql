const { seedDatabase, users, clubs } = require("./utils/seedDatabase");
const {
    createClub,
    getClubs,
    getClub,
    updateClub,
    addClubManager,
    removeClubManager,
    joinClub,
    leaveClub,
    removeClubMember,
    deleteClub
} = require("./operations/clubOperations");
const getClient = require("./utils/getClient");
const ClubModel = require("../src/models/ClubModel");

const client = getClient();

describe("Clubs", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    clubs: true
                }
            })
    );

    test("Should create a new club", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            data: {
                name: "B",
                location: "C",
                website: "example2.com"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: createClub,
            variables
        });

        expect(data.createClub.name).toEqual("B");
        expect(data.createClub.location).toEqual("C");
        expect(data.createClub.website).toEqual("example2.com");
        expect(data.createClub.managers[0].id).toEqual(users[0].output.id);

        const club = await ClubModel.findOne({
            _id: data.createClub.id
        });

        expect(club.name).toEqual("B");
    });

    test("Should fail to create a new club if not logged in", async () => {
        const variables = {
            data: {
                name: "B",
                location: "C",
                website: "example2.com"
            }
        };

        await expect(
            client.mutate({
                mutation: createClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should return club by ID", async () => {
        const variables = {
            id: clubs[0].output.id
        };

        const { data } = await client.query({
            query: getClub,
            variables
        });

        expect(data.club.name).toEqual(clubs[0].input.name);
        expect(data.club.location).toEqual(clubs[0].input.location);
        expect(data.club.website).toEqual(clubs[0].input.website);
        expect(data.club.managers[0].id).toEqual(users[0].output.id);
    });

    test("Should return a list of clubs", async () => {
        const { data } = await client.query({
            query: getClubs
        });

        expect(data.clubs.data.length).toEqual(2);

        expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
        expect(data.clubs.data[0].location).toEqual(clubs[0].input.location);
        expect(data.clubs.data[0].website).toEqual(clubs[0].input.website);
        expect(data.clubs.data[0].managers[0].id).toEqual(users[0].output.id);
    });

    test("Should return one club by other property", async () => {
        const variables = {
            where: {
                name: clubs[0].input.name
            }
        };

        const { data } = await client.query({
            query: getClubs,
            variables
        });

        expect(data.clubs.data.length).toEqual(1);

        expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
        expect(data.clubs.data[0].location).toEqual(clubs[0].input.location);
        expect(data.clubs.data[0].website).toEqual(clubs[0].input.website);
        expect(data.clubs.data[0].managers[0].id).toEqual(users[0].output.id);
    });

    test("Should sort results", async () => {
        const variables = {
            sortBy: "name",
            sortOrder: "DESC"
        };

        const { data } = await client.query({
            query: getClubs,
            variables
        });

        expect(data.clubs.data.length).toEqual(2);
        expect(data.clubs.data[0].name).toEqual(clubs[1].input.name);
    });

    test("Should limit results", async () => {
        const variables = {
            limit: 1
        };

        const { data } = await client.query({
            query: getClubs,
            variables
        });

        expect(data.clubs.data.length).toEqual(1);
        expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
    });

    test("Should update club", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: updateClub,
            variables
        });

        expect(data.updateClub.name).toEqual("Updated name");
    });

    test("Should fail to update club if not logged in", async () => {
        const variables = {
            id: clubs[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        await expect(
            client.mutate({
                mutation: updateClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to update club if not a manager", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[0].output.id,
            data: {
                name: "Updated name"
            }
        };

        await expect(
            authenticatedClient.mutate({
                mutation: updateClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should add club manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: addClubManager,
            variables
        });

        expect(data.addClubManager.managers.length).toEqual(2);
        expect(data.addClubManager.managers[1].id).toEqual(users[1].output.id);
    });

    test("Should fail to add club manager if not logged in", async () => {
        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        await expect(
            client.mutate({
                mutation: addClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add club manager if not logged in as manager", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[2].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: addClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to add club manager if already a manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: addClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should remove club manager", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[1].output.id,
            userId: users[2].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: removeClubManager,
            variables
        });

        expect(data.removeClubManager.managers.length).toEqual(1);
        expect(data.removeClubManager.managers[0].id).toEqual(
            users[1].output.id
        );
    });

    test("Should fail to remove club manager if not logged in", async () => {
        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        await expect(
            client.mutate({
                mutation: removeClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to remove club manager if not logged in as a manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to remove club manager if user to be removed is not a manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeClubManager,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should join club", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: clubs[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: joinClub,
            variables
        });

        expect(data.joinClub.members.length).toEqual(2);
        expect(data.joinClub.members[1].id).toEqual(users[2].output.id);
    });

    test("Should fail to join club if not logged in", async () => {
        const variables = {
            id: clubs[0].output.id
        };

        await expect(
            client.mutate({
                mutation: joinClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to join club if already a member", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: joinClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should leave club", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: leaveClub,
            variables
        });

        expect(data.leaveClub.members.length).toEqual(0);
    });

    test("Should fail to leave club if not logged in", async () => {
        const variables = {
            id: clubs[0].output.id
        };

        await expect(
            client.mutate({
                mutation: leaveClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to leave club if not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: clubs[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: leaveClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should remove club member", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[1].output.id,
            userId: users[0].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: removeClubMember,
            variables
        });

        expect(data.removeClubMember.members.length).toEqual(0);
    });

    test("Should fail to remove club member if not logged in", async () => {
        const variables = {
            id: clubs[1].output.id,
            userId: users[0].output.id
        };

        await expect(
            client.mutate({
                mutation: removeClubMember,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to remove club manager if not logged in as a manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[1].output.id,
            userId: users[0].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeClubMember,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to remove club manager if user to be removed is not a member", async () => {
        const authenticatedClient = getClient(users[2].token);

        const variables = {
            id: clubs[0].output.id,
            userId: users[1].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: removeClubMember,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should delete club", async () => {
        const authenticatedClient = getClient(users[1].token);

        const variables = {
            id: clubs[1].output.id
        };

        const { data } = await authenticatedClient.mutate({
            mutation: deleteClub,
            variables
        });

        expect(data.deleteClub.id).toEqual(clubs[1].output.id);
    });

    test("Should fail to delete club if not logged in", async () => {
        const variables = {
            id: clubs[1].output.id
        };

        await expect(
            client.mutate({
                mutation: deleteClub,
                variables
            })
        ).rejects.toThrow();
    });

    test("Should fail to delete club if not logged in as a manager", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            id: clubs[1].output.id
        };

        await expect(
            authenticatedClient.mutate({
                mutation: deleteClub,
                variables
            })
        ).rejects.toThrow();
    });
});
