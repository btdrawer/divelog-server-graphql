module.exports = {
    club: async ({ club }, args, { loaders }) =>
        club ? await loaders.clubLoader.load(club.toString()) : null,
    user: async ({ user }, args, { loaders }) =>
        await loaders.userLoader.load(user.toString()),
    buddies: async ({ buddies }, args, { loaders }) =>
        buddies.map(
            async buddy => await loaders.userLoader.load(buddy.toString())
        ),
    gear: async ({ gear }, args, { loaders }) =>
        gear.map(
            async gearId => await loaders.gearLoader.load(gearId.toString())
        )
};
