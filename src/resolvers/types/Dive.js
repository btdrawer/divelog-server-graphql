module.exports = {
    club: ({ club }, args, { loaders }) =>
        club ? loaders.clubLoader.load(club.toString()) : null,
    user: ({ user }, args, { loaders }) =>
        loaders.userLoader.load(user.toString()),
    buddies: ({ buddies }, args, { loaders }) =>
        buddies.map(
            async buddy => await loaders.userLoader.load(buddy.toString())
        ),
    gear: ({ gear }, args, { loaders }) =>
        gear.map(
            async gearId => await loaders.gearLoader.load(gearId.toString())
        )
};
