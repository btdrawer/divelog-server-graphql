import { models } from "@btdrawer/divelog-server-utils";
import { seedDatabase, users, clubs } from "./utils/seedDatabase";
import {
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
} from "./operations/clubOperations";
import getClient from "./utils/getClient";

const { ClubModel } = models;
const client = getClient();

describe("Clubs", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                clubs: true
            })
    );

    describe("When logged in as a manager of an existing club", () => {
        let authenticatedClient = getClient(users[0].token);

        beforeEach(() => {
            authenticatedClient = getClient(users[0].token);
        });

        describe("and using valid inputs", () => {
            test("should create a new club", async () => {
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
                expect(data.createClub.managers[0].id).toEqual(
                    users[0].output.id
                );

                const club = await ClubModel.findOne({
                    _id: data.createClub.id
                });

                if (club) {
                    expect(club.name).toEqual("B");
                } else {
                    expect(club).not.toBeNull();
                }
            });

            test("should return club by ID", async () => {
                const variables = {
                    id: clubs[0].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getClub,
                    variables
                });

                expect(data.club.name).toEqual(clubs[0].input.name);
                expect(data.club.location).toEqual(clubs[0].input.location);
                expect(data.club.website).toEqual(clubs[0].input.website);
                expect(data.club.managers[0].id).toEqual(users[0].output.id);
            });

            test("should return a list of clubs", async () => {
                const { data } = await authenticatedClient.query({
                    query: getClubs
                });

                expect(data.clubs.data.length).toEqual(2);

                expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
                expect(data.clubs.data[0].location).toEqual(
                    clubs[0].input.location
                );
                expect(data.clubs.data[0].website).toEqual(
                    clubs[0].input.website
                );
                expect(data.clubs.data[0].managers[0].id).toEqual(
                    users[0].output.id
                );
            });

            test("should return one club by other property", async () => {
                const variables = {
                    where: {
                        name: clubs[0].input.name
                    }
                };

                const { data } = await authenticatedClient.query({
                    query: getClubs,
                    variables
                });

                expect(data.clubs.data.length).toEqual(1);

                expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
                expect(data.clubs.data[0].location).toEqual(
                    clubs[0].input.location
                );
                expect(data.clubs.data[0].website).toEqual(
                    clubs[0].input.website
                );
                expect(data.clubs.data[0].managers[0].id).toEqual(
                    users[0].output.id
                );
            });

            test("should sort results", async () => {
                const variables = {
                    sortBy: "name",
                    sortOrder: "DESC"
                };

                const { data } = await authenticatedClient.query({
                    query: getClubs,
                    variables
                });

                expect(data.clubs.data.length).toEqual(2);
                expect(data.clubs.data[0].name).toEqual(clubs[1].input.name);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 1
                };

                const { data } = await authenticatedClient.query({
                    query: getClubs,
                    variables
                });

                expect(data.clubs.data.length).toEqual(1);
                expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
            });

            test("should update club", async () => {
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

            test("should add club manager", async () => {
                const variables = {
                    id: clubs[0].output.id,
                    userId: users[1].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: addClubManager,
                    variables
                });

                expect(data.addClubManager.managers.length).toEqual(3);
                expect(data.addClubManager.managers[2].id).toEqual(
                    users[1].output.id
                );
            });

            test("should remove club manager", async () => {
                const variables = {
                    id: clubs[0].output.id,
                    userId: users[2].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: removeClubManager,
                    variables
                });

                expect(data.removeClubManager.managers.length).toEqual(1);
                expect(data.removeClubManager.managers[0].id).toEqual(
                    users[0].output.id
                );
            });

            test("Should remove club member", async () => {
                const variables = {
                    id: clubs[0].output.id,
                    userId: users[1].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: removeClubMember,
                    variables
                });

                expect(data.removeClubMember.members.length).toEqual(0);
            });

            test("Should delete club", async () => {
                const variables = {
                    id: clubs[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: deleteClub,
                    variables
                });

                expect(data.deleteClub.id).toEqual(clubs[0].output.id);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to create a new club without a name", async () => {
                const variables = {
                    data: {
                        location: "C",
                        website: "example2.com"
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: createClub,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to create a new club without a location", async () => {
                const variables = {
                    data: {
                        name: "B",
                        website: "example2.com"
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: createClub,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add club manager if user already a manager", async () => {
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

            test("should fail to remove club manager if user to be removed is not a manager", async () => {
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

            test("should fail to remove club member if user to be removed is not a member", async () => {
                const variables = {
                    id: clubs[1].output.id,
                    userId: users[1].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: removeClubMember,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When logged in, but not as a manager", () => {
        let authenticatedClient = getClient(users[1].token);

        beforeEach(() => {
            authenticatedClient = getClient(users[1].token);
        });

        describe("and using valid inputs", () => {
            test("should join club", async () => {
                const variables = {
                    id: clubs[1].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: joinClub,
                    variables
                });

                expect(data.joinClub.members.length).toEqual(2);
                expect(data.joinClub.members[1].id).toEqual(users[1].output.id);
            });

            test("should leave club", async () => {
                const variables = {
                    id: clubs[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: leaveClub,
                    variables
                });

                expect(data.leaveClub.members.length).toEqual(0);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to update club", async () => {
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

            test("should fail to add club manager", async () => {
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

            test("should fail to remove club manager", async () => {
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

            test("should fail to join club if already a member", async () => {
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

            test("should fail to leave club if not a member", async () => {
                const variables = {
                    id: clubs[1].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: leaveClub,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to remove club manager", async () => {
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

            test("should fail to delete club", async () => {
                const variables = {
                    id: clubs[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: deleteClub,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When not logged in", () => {
        describe("and making data queries", () => {
            test("should return club by ID", async () => {
                const variables = {
                    id: clubs[0].output.id
                };

                const { data } = await client.query({
                    query: getClub,
                    variables
                });

                expect(data).not.toBeNull();
                expect(data.club.name).toEqual(clubs[0].input.name);
                expect(data.club.location).toEqual(clubs[0].input.location);
                expect(data.club.website).toEqual(clubs[0].input.website);
                expect(data.club.managers[0].id).toEqual(users[0].output.id);
            });

            test("should return a list of clubs", async () => {
                const { data } = await client.query({
                    query: getClubs
                });

                expect(data.clubs.data.length).toEqual(2);

                expect(data.clubs.data[0].name).toEqual(clubs[0].input.name);
                expect(data.clubs.data[0].location).toEqual(
                    clubs[0].input.location
                );
                expect(data.clubs.data[0].website).toEqual(
                    clubs[0].input.website
                );
                expect(data.clubs.data[0].managers[0].id).toEqual(
                    users[0].output.id
                );
            });

            test("should return one club by other property", async () => {
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
                expect(data.clubs.data[0].location).toEqual(
                    clubs[0].input.location
                );
                expect(data.clubs.data[0].website).toEqual(
                    clubs[0].input.website
                );
                expect(data.clubs.data[0].managers[0].id).toEqual(
                    users[0].output.id
                );
            });

            test("should sort results", async () => {
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

            test("should limit results", async () => {
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
        });

        describe("and attempting to mutate data", () => {
            test("should fail to create a new club", async () => {
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

            test("should fail to update club", async () => {
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

            test("should fail to add club manager", async () => {
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

            test("should fail to remove club manager", async () => {
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

            test("should fail to join club", async () => {
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

            test("should fail to leave club", async () => {
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

            test("should fail to remove club member", async () => {
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

            test("should fail to delete club", async () => {
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
        });
    });
});
