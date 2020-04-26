const { seedDatabase, users, dives, gear } = require("./utils/seedDatabase");
const {
    createDive,
    getDives,
    getMyDives,
    getDive,
    updateDive,
    addGearToDive,
    removeGearFromDive,
    addBuddyToDive,
    removeBuddyFromDive,
    deleteDive
} = require("./operations/diveOperations");
const getClient = require("./utils/getClient");
const DiveModel = require("../src/models/DiveModel");

const client = getClient();
let authenticatedClient;

describe("Dives", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    dives: true,
                    clubs: true,
                    gear: true
                }
            })
    );

    describe("When logged in", () => {
        beforeEach(() => {
            authenticatedClient = getClient(users[0].token);
        });

        describe("and using valid inputs", () => {
            test("should create dive", async () => {
                const variables = {
                    data: {
                        timeIn: "2020-01-01T11:00:00",
                        timeOut: "2020-01-01T11:25:00",
                        bottomTime: 22.0,
                        safetyStopTime: 3.0,
                        maxDepth: 17.3,
                        location: "Sample location",
                        description: "Dive description",
                        public: true
                    }
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: createDive,
                    variables
                });

                expect(data.createDive.diveTime).toEqual(25); // bottomTime + safetyStopTime
                expect(data.createDive.user.id).toEqual(users[0].output.id);
                expect(data.createDive.public).toEqual(true);

                const diveInDatabase = await DiveModel.findOne({
                    _id: data.createDive.id
                });

                expect(diveInDatabase.description).toEqual("Dive description");
            });

            test("Should return a users public dives", async () => {
                const variables = {
                    userId: users[1].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getDives,
                    variables
                });

                expect(data.dives.data.length).toEqual(2);
            });

            test("Should limit results", async () => {
                const variables = {
                    userId: users[1].output.id,
                    limit: 1
                };

                const { data } = await authenticatedClient.query({
                    query: getDives,
                    variables
                });

                expect(data.dives.data.length).toEqual(1);
                expect(data.dives.data[0].id).toEqual(dives[1].output.id);
            });

            test("should return next page", async () => {
                const requestOneVariables = {
                    userId: users[1].output.id,
                    limit: 1
                };

                const {
                    data: requestOneData
                } = await authenticatedClient.query({
                    query: getDives,
                    variables: requestOneVariables
                });

                const { cursor } = requestOneData.dives.pageInfo;

                const requestTwoVariables = {
                    userId: users[1].output.id,
                    cursor
                };

                const {
                    data: requestTwoData
                } = await authenticatedClient.query({
                    query: getDives,
                    variables: requestTwoVariables
                });

                expect(requestTwoData.dives.data.length).toEqual(1);
                expect(requestTwoData.dives.data[0].id).toEqual(
                    dives[4].output.id
                );
            });

            test("should return all dives for the authenticated user", async () => {
                const { data } = await authenticatedClient.query({
                    query: getMyDives
                });

                expect(data.myDives.data.length).toEqual(2);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 1
                };

                const { data } = await authenticatedClient.query({
                    query: getMyDives,
                    variables
                });

                expect(data.myDives.data.length).toEqual(1);
                expect(data.myDives.data[0].id).toEqual(dives[0].output.id);
            });

            test("should return next page", async () => {
                const requestOneVariables = {
                    limit: 1
                };

                const {
                    data: requestOneData
                } = await authenticatedClient.query({
                    query: getMyDives,
                    variables: requestOneVariables
                });

                const { cursor } = requestOneData.myDives.pageInfo;

                const requestTwoVariables = {
                    cursor
                };

                const {
                    data: requestTwoData
                } = await authenticatedClient.query({
                    query: getMyDives,
                    variables: requestTwoVariables
                });

                expect(requestTwoData.myDives.data.length).toEqual(1);
                expect(requestTwoData.myDives.data[0].id).toEqual(
                    dives[2].output.id
                );
            });

            test("Should return a public dive by its ID", async () => {
                const variables = {
                    id: dives[0].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getDive,
                    variables
                });

                expect(data.dive.description).toEqual(
                    dives[0].input.description
                );
            });

            test("should return a private dive by its ID if it belongs to the authenticated user", async () => {
                const variables = {
                    id: dives[0].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getDive,
                    variables
                });

                expect(data.dive.description).toEqual(
                    dives[1].input.description
                );
            });

            test("should update dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    data: {
                        timeIn: "2020-01-04T12:30:00",
                        timeOut: "2020-01-04T13:05:00",
                        bottomTime: 32.0,
                        safetyStopTime: 3.0
                    }
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: updateDive,
                    variables
                });

                expect(data.updateDive.diveTime).toEqual(35);
            });

            test("should add gear to dive", async () => {
                const variables = {
                    id: dives[2].output.id,
                    gearId: gear[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: addGearToDive,
                    variables
                });

                expect(data.addGearToDive.gear.length).toEqual(1);
                expect(data.addGearToDive.gear[0].id).toEqual(
                    gear[0].output.id
                );
            });

            test("should remove gear from dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    gearId: gear[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: removeGearFromDive,
                    variables
                });

                expect(data.removeGearFromDive.gear.length).toEqual(0);
            });

            test("should add buddy to dive", async () => {
                const variables = {
                    id: dives[2].output.id,
                    buddyId: users[2].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: addBuddyToDive,
                    variables
                });

                expect(data.addBuddyToDive.buddies.length).toEqual(1);
                expect(data.addBuddyToDive.buddies[0].id).toEqual(
                    users[2].output.id
                );
            });

            test("should remove buddy from dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    buddyId: users[1].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: removeBuddyFromDive,
                    variables
                });

                expect(data.removeBuddyFromDive.buddies.length).toEqual(0);
            });

            test("should delete dive", async () => {
                const variables = {
                    id: dives[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: deleteDive,
                    variables
                });

                expect(data.deleteDive.id).toEqual(dives[0].output.id);
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to return a private dive if it belongs to a different user", async () => {
                const variables = {
                    id: dives[3].output.id
                };

                await expect(
                    authenticatedClient.query({
                        query: getDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to update another users dive", async () => {
                const variables = {
                    id: dives[1].output.id,
                    data: {
                        timeIn: "2020-01-04T12:30:00",
                        timeOut: "2020-01-04T13:05:00",
                        bottomTime: 32.0,
                        safetyStopTime: 3.0
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: updateDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add gear to another users dive", async () => {
                const variables = {
                    id: dives[1].output.id,
                    gearId: gear[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: addGearToDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to remove gear from another users dive", async () => {
                const variables = {
                    id: dives[1].output.id,
                    gearId: gear[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: removeGearFromDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add buddy to another users dive", async () => {
                const variables = {
                    id: dives[1].output.id,
                    buddyId: users[2].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: addBuddyToDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to remove buddy from another users dive", async () => {
                const variables = {
                    id: dives[1].output.id,
                    buddyId: users[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: removeBuddyFromDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to delete another users dive", async () => {
                const variables = {
                    id: dives[1].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: deleteDive,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When not logged in", () => {
        describe("and using valid inputs", () => {
            test("should return a users public dives", async () => {
                const variables = {
                    userId: users[0].output.id
                };

                const { data } = await client.query({
                    query: getDives,
                    variables
                });

                expect(data.dives.data.length).toEqual(2);
            });

            test("should limit results", async () => {
                const variables = {
                    userId: users[0].output.id,
                    limit: 1
                };

                const { data } = await client.query({
                    query: getDives,
                    variables
                });

                expect(data.dives.data.length).toEqual(1);
                expect(data.dives.data[0].id).toEqual(dives[0].output.id);
            });

            test("should return next page", async () => {
                const requestOneVariables = {
                    userId: users[0].output.id,
                    limit: 1
                };

                const {
                    data: requestOneData
                } = await authenticatedClient.query({
                    query: getDives,
                    variables: requestOneVariables
                });

                const { cursor } = requestOneData.dives.pageInfo;

                const requestTwoVariables = {
                    userId: users[0].output.id,
                    cursor
                };

                const {
                    data: requestTwoData
                } = await authenticatedClient.query({
                    query: getDives,
                    variables: requestTwoVariables
                });

                expect(requestTwoData.dives.data.length).toEqual(1);
                expect(requestTwoData.dives.data[0].id).toEqual(
                    dives[2].output.id
                );
            });

            test("should return a public dive by its ID", async () => {
                const variables = {
                    id: dives[0].output.id
                };

                const { data } = await client.query({
                    query: getDive,
                    variables
                });

                expect(data.dive.description).toEqual(
                    dives[0].input.description
                );
            });
        });

        describe("and using invalid inputs", () => {
            test("should fail to create dive", async () => {
                const variables = {
                    data: {
                        timeIn: "2020-01-01T11:00:00",
                        timeOut: "2020-01-01T11:25:00",
                        bottomTime: 22.0,
                        safetyStopTime: 3.0,
                        maxDepth: 17.3,
                        location: "Sample location",
                        description: "Dive description",
                        public: true
                    }
                };

                await expect(
                    client.mutate({
                        mutation: createDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to return dives for the authenticated user", async () => {
                await expect(
                    client.query({
                        query: getMyDives
                    })
                ).rejects.toThrow();
            });

            test("Should fail to return a private dive", async () => {
                const variables = {
                    id: dives[3].output.id
                };

                await expect(
                    client.query({
                        query: getDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to update dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    data: {
                        timeIn: "2020-01-04T12:30:00",
                        timeOut: "2020-01-04T13:05:00",
                        bottomTime: 32.0,
                        safetyStopTime: 3.0
                    }
                };

                await expect(
                    client.mutate({
                        mutate: updateDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add gear to dive", async () => {
                const variables = {
                    id: dives[2].output.id,
                    gearId: gear[0].output.id
                };

                await expect(
                    client.mutate({
                        mutation: addGearToDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to remove gear from dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    gearId: gear[0].output.id
                };

                await expect(
                    client.mutate({
                        mutation: removeGearFromDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add buddy to dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    buddyId: users[2].output.id
                };

                await expect(
                    client.mutate({
                        mutation: addBuddyToDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to add buddy to dive", async () => {
                const variables = {
                    id: dives[0].output.id,
                    buddyId: users[2].output.id
                };

                await expect(
                    client.mutate({
                        mutation: removeBuddyFromDive,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to delete dive", async () => {
                const variables = {
                    id: dives[0].output.id
                };

                await expect(
                    client.mutate({
                        mutation: deleteDive,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });
});
