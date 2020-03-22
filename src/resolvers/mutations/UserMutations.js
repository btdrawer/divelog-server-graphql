const UserModel = require("../../models/UserModel");
const { getUserId } = require("../../authentication/authUtils");
const {
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} = require("../../constants/errorCodes");

const formatAuthPayload = result => ({
    user: {
        id: result._id,
        name: result.name,
        username: result.username,
        email: result.email
    },
    token: result.token
});

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
    updateUser: async (parent, { data }, { request }) =>
        UserModel.findOneAndUpdate(
            {
                _id: getUserId(request)
            },
            data,
            { new: true }
        ),
    sendOrAcceptFriendRequest: async (parent, { id }, { request }) => {
        const myId = getUserId(request);
        if (id === myId) {
            throw new Error(CANNOT_ADD_YOURSELF);
        }
        const checkInbox = await UserModel.findOne(
            {
                _id: myId
            },
            ["friends", "friendRequests"]
        );
        if (checkInbox.friendRequests.sent.includes(id)) {
            throw new Error(FRIEND_REQUEST_ALREADY_SENT);
        } else if (checkInbox.friends.includes(id)) {
            throw new Error(ALREADY_FRIENDS);
        } else if (checkInbox.friendRequests.inbox.includes(id)) {
            // Accept request
            return UserModel.accept(myId, id);
        }
        // Send request
        return UserModel.add(myId, id);
    },
    unfriend: async (parent, { id }, { request }) => {
        const myId = getUserId(request);
        return UserModel.unfriend(myId, id);
    },
    deleteUser: async (parent, args, { request }) =>
        UserModel.findOneAndDelete({
            _id: getUserId(request)
        })
};
