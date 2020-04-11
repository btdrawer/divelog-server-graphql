const { seedDatabase, users, gear } = require("./utils/seedDatabase");
const {
    createGear,
    getGear,
    updateGear,
    deleteGear
} = require("./operations/gearOperations");
const getClient = require("./utils/getClient");
const GearModel = require("../src/models/GearModel");

const client = getClient();

describe("Gear", () => {
    beforeEach(
        async () =>
            await seedDatabase({
                resources: {
                    gear: true
                }
            })
    );

    test("Should create gear", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to create gear if not logged in", async () => {
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

    test("Should return a list of users gear", async () => {
        const authenticatedClient = getClient(users[0].token);

        const { data } = await authenticatedClient.query({
            query: getGear
        });

        expect(data.gear.data.length).toEqual(2);
        expect(data.gear.data[0].name).toEqual(gear[0].input.name);
    });

    test("Should not return any gear if not logged in", async () => {
        await expect(
            client.query({
                query: getGear
            })
        ).rejects.toThrow();
    });

    test("Should return one gear by ID", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            where: {
                id: gear[0].output.id
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: getGear,
            variables
        });

        expect(data.gear.data.length).toEqual(1);
        expect(data.gear.data[0].name).toEqual(gear[0].input.name);
    });

    test("Should return one gear by other property", async () => {
        const authenticatedClient = getClient(users[0].token);

        const variables = {
            where: {
                name: gear[0].input.name
            }
        };

        const { data } = await authenticatedClient.mutate({
            mutation: getGear,
            variables
        });

        expect(data.gear.data.length).toEqual(1);
        expect(data.gear.data[0].name).toEqual(gear[0].input.name);
    });

    test("Should sort results", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should limit results", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should update gear", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to update gear if not logged in", async () => {
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

    test("Should fail to update another users gear", async () => {
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

    test("Should delete gear", async () => {
        const authenticatedClient = getClient(users[0].token);

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

    test("Should fail to delete gear if not logged in", async () => {
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

    test("Should fail to delete another users gear", async () => {
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
