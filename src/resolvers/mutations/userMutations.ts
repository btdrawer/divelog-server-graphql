import { combineResolvers } from "graphql-resolvers";
import { models, errorCodes } from "@btdrawer/divelog-server-utils";
import { isAuthenticated } from "../middleware";
import { Context } from "../../types";
import { formatAuthPayload } from "../../utils";

const { UserModel } = models;
const {
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} = errorCodes;

export const createUser = async (parent: any, { data }: any) => {
    const user = await new UserModel(data).save();
    return formatAuthPayload(user);
};

export const login = async (parent: any, { username, password }: any) => {
    const result = await UserModel.authenticate(username, password);
    return formatAuthPayload(result);
};

export const updateUser = combineResolvers(
    isAuthenticated,
    (parent: any, { data }: any, { authUserId }: Context) =>
        UserModel.findByIdAndUpdate(authUserId, data, { new: true })
);

export const sendOrAcceptFriendRequest = combineResolvers(
    isAuthenticated,
    async (parent: any, { id }: any, { authUserId }: Context) => {
        if (id === authUserId) {
            throw new Error(CANNOT_ADD_YOURSELF);
        }
        const checkInbox = await UserModel.findById(authUserId, [
            "friends",
            "friendRequests"
        ]);
        if (checkInbox) {
            if (checkInbox.friendRequests.sent.includes(id)) {
                throw new Error(FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox.friends.includes(id)) {
                throw new Error(ALREADY_FRIENDS);
            } else if (checkInbox.friendRequests.inbox.includes(id)) {
                // Accept request
                return UserModel.accept(<string>authUserId, id);
            }
        }
        // Send request
        return UserModel.add(<string>authUserId, id);
    }
);

export const unfriend = combineResolvers(
    isAuthenticated,
    (parent: any, { id }: any, { authUserId }: Context) =>
        UserModel.unfriend(<string>authUserId, id)
);

export const deleteUser = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId }: Context) =>
        UserModel.findByIdAndDelete(authUserId)
);
