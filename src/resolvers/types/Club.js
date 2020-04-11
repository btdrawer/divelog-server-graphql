module.exports = {
    managers: async ({ managers }, args, { loaders }) =>
        managers.map(
            async manager => await loaders.userLoader.load(manager.toString())
        ),
    members: ({ members }, args, { loaders }) =>
        members.map(
            async member => await loaders.userLoader.load(member.toString())
        )
};
