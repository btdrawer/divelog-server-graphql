const { GearModel } = require("@btdrawer/divelog-server-utils").models;
const { seedDatabase, users, gear, close } = require("./utils/seedDatabase");
const {
    createGear,
    getGear,
    getGearById,
    updateGear,
    deleteGear
} = require("./operations/gearOperations");
const getClient = require("./utils/getClient");

const client = getClient();
let authenticatedClient;

describe("Gear", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    gear: true
                }
            })
    );

    describe("When logged in", () => {
        beforeEach(() => {
            authenticatedClient = getClient(users[0].token);
        });

        describe("When using valid inputs", () => {
            test("Should create gear", async () => {
                const variables = {
                    data: {
                        name: "B",
                        brand: "C",
                        model: "D",
                        type: "E"
                    }
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: createGear,
                    variables
                });

                expect(data.createGear.name).toEqual("B");
                expect(data.createGear.brand).toEqual("C");
                expect(data.createGear.model).toEqual("D");
                expect(data.createGear.type).toEqual("E");

                const gearInDatabase = await GearModel.findOne({
                    _id: data.createGear.id
                });

                expect(gearInDatabase.name).toEqual("B");
            });

            test("should return a list of users gear", async () => {
                const { data } = await authenticatedClient.query({
                    query: getGear
                });

                expect(data.gear.data.length).toEqual(2);
                expect(data.gear.data[0].name).toEqual(gear[0].input.name);
            });

            test("should return one gear by other property", async () => {
                const variables = {
                    where: {
                        name: gear[0].input.name
                    }
                };

                const { data } = await authenticatedClient.query({
                    query: getGear,
                    variables
                });

                expect(data.gear.data.length).toEqual(1);
                expect(data.gear.data[0].name).toEqual(gear[0].input.name);
            });

            test("Should sort results", async () => {
                const variables = {
                    sortBy: "name",
                    sortOrder: "DESC"
                };

                const { data } = await authenticatedClient.query({
                    query: getGear,
                    variables
                });

                expect(data.gear.data.length).toEqual(2);
                expect(data.gear.data[0].name).toEqual(gear[1].input.name);
            });

            test("should limit results", async () => {
                const variables = {
                    limit: 1
                };

                const { data } = await authenticatedClient.query({
                    query: getGear,
                    variables
                });

                expect(data.gear.data.length).toEqual(1);
                expect(data.gear.data[0].name).toEqual(gear[0].input.name);
            });

            test("should return next page", async () => {
                const requestOneVariables = {
                    limit: 1
                };

                const {
                    data: requestOneData
                } = await authenticatedClient.query({
                    query: getGear,
                    variables: requestOneVariables
                });

                const { cursor } = requestOneData.gear.pageInfo;

                const requestTwoVariables = {
                    cursor
                };

                const {
                    data: requestTwoData
                } = await authenticatedClient.query({
                    query: getGear,
                    variables: requestTwoVariables
                });

                expect(requestTwoData.gear.data.length).toEqual(1);
                expect(requestTwoData.gear.data[0].id).toEqual(
                    gear[1].output.id
                );
            });

            test("should return gear by ID", async () => {
                const variables = {
                    id: gear[0].output.id
                };

                const { data } = await authenticatedClient.query({
                    query: getGearById,
                    variables
                });

                expect(data.gearById.name).toEqual(gear[0].input.name);
            });

            test("should update gear", async () => {
                const variables = {
                    id: gear[0].output.id,
                    data: {
                        name: "Updated name"
                    }
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: updateGear,
                    variables
                });

                expect(data.updateGear.name).toEqual("Updated name");
            });

            test("should delete gear", async () => {
                const variables = {
                    id: gear[0].output.id
                };

                const { data } = await authenticatedClient.mutate({
                    mutation: deleteGear,
                    variables
                });

                expect(data.deleteGear.id).toEqual(gear[0].output.id);

                const gearInDatabase = await GearModel.findOne({
                    _id: gear[0].output.id
                });

                expect(gearInDatabase).toBe(null);
            });
        });

        describe("When using invalid inputs", () => {
            test("should fail to return gear by ID if it belongs to a different user", async () => {
                const variables = {
                    id: gear[2].output.id
                };

                await expect(
                    authenticatedClient.query({
                        query: getGearById,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to update another users gear", async () => {
                const authenticatedClient = getClient(users[1].token);

                const variables = {
                    id: gear[0].output.id,
                    data: {
                        name: "Updated name"
                    }
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: updateGear,
                        variables
                    })
                ).rejects.toThrow();
            });

            test("should fail to delete another users gear", async () => {
                const authenticatedClient = getClient(users[1].token);

                const variables = {
                    id: gear[0].output.id
                };

                await expect(
                    authenticatedClient.mutate({
                        mutation: deleteGear,
                        variables
                    })
                ).rejects.toThrow();
            });
        });
    });

    describe("When not logged in", () => {
        test("should fail to create gear", async () => {
            const variables = {
                data: {
                    name: "B",
                    brand: "C",
                    model: "D",
                    type: "E"
                }
            };

            await expect(
                client.mutate({
                    mutation: createGear,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should not return any gear", async () => {
            await expect(
                client.query({
                    query: getGear
                })
            ).rejects.toThrow();
        });

        test("should fail to return gear by ID", async () => {
            const variables = {
                id: gear[0].output.id
            };

            await expect(
                client.query({
                    query: getGearById,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to update gear", async () => {
            const variables = {
                id: gear[0].output.id,
                data: {
                    name: "Updated name"
                }
            };

            await expect(
                client.mutate({
                    mutation: updateGear,
                    variables
                })
            ).rejects.toThrow();
        });

        test("should fail to delete gear", async () => {
            const variables = {
                id: gear[0].output.id
            };

            await expect(
                client.mutate({
                    mutation: deleteGear,
                    variables
                })
            ).rejects.toThrow();
        });
    });

    afterAll(async () => await close());
});
