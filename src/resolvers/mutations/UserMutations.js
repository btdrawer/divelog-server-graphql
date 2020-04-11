const { combineResolvers } = require("graphql-resolvers");

const UserModel = require("../../models/UserModel");
const {
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} = require("../../constants/errorCodes");
const { isAuthenticated } = require("../middleware");
const { formatAuthPayload } = require("../../utils");

module.exports = {
    createUser: async (parent, { data }) => {
        const user = new UserModel(data);
        await user.save();
        return formatAuthPayload(user);
    },
    login: async (parent, { username, password }) => {
        const result = await UserModel.authenticate(username, password);
        return formatAuthPayload(result);
    },
    updateUser: combineResolvers(
        isAuthenticated,
        (parent, { data }, { authUserId }) =>
            UserModel.findByIdAndUpdate(authUserId, data, { new: true })
    ),
    sendOrAcceptFriendRequest: combineResolvers(
        isAuthenticated,
        async (parent, { id }, { authUserId }) => {
            if (id === authUserId) {
                throw new Error(CANNOT_ADD_YOURSELF);
            }
            const checkInbox = await UserModel.findById(authUserId, [
                "friends",
                "friendRequests"
            ]);
            if (checkInbox.friendRequests.sent.includes(id)) {
                throw new Error(FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox.friends.includes(id)) {
                throw new Error(ALREADY_FRIENDS);
            } else if (checkInbox.friendRequests.inbox.includes(id)) {
                // Accept request
                return UserModel.accept(authUserId, id);
            }
            // Send request
            return UserModel.add(authUserId, id);
        }
    ),
    unfriend: combineResolvers(
        isAuthenticated,
        (parent, { id }, { authUserId }) => UserModel.unfriend(authUserId, id)
    ),
    deleteUser: combineResolvers(
        isAuthenticated,
        (parent, args, { authUserId }) =>
            UserModel.findByIdAndDelete(authUserId)
    )
};
