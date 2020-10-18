import { combineResolvers } from "graphql-resolvers";
import { User, errorCodes } from "@btdrawer/divelog-server-core";
import { isAuthenticated } from "../middleware";
import { Context } from "../../types";
import { formatAuthPayload } from "../../utils";

const {
    CANNOT_ADD_YOURSELF,
    FRIEND_REQUEST_ALREADY_SENT,
    ALREADY_FRIENDS
} = errorCodes;

export const createUser = async (parent: any, { data }: any) => {
    const user = await User.create(data);
    return formatAuthPayload(user);
};

export const login = async (parent: any, { username, password }: any) => {
    const result = await User.login(username, password);
    return formatAuthPayload(result);
};

export const updateUser = combineResolvers(
    isAuthenticated,
    (parent: any, { data }: any, { authUserId }: Context) =>
        User.update(authUserId, data)
);

export const sendOrAcceptFriendRequest = combineResolvers(
    isAuthenticated,
    async (parent: any, { id }: any, { authUserId }: Context) => {
        if (id === authUserId) {
            throw new Error(CANNOT_ADD_YOURSELF);
        }
        const checkInbox = await User.get(authUserId);
        if (checkInbox) {
            if (checkInbox.friendRequests.sent.includes(id)) {
                throw new Error(FRIEND_REQUEST_ALREADY_SENT);
            } else if (checkInbox.friends.includes(id)) {
                throw new Error(ALREADY_FRIENDS);
            } else if (checkInbox.friendRequests.inbox.includes(id)) {
                // Accept request
                return User.accept(authUserId, id);
            }
        }
        // Send request
        return User.add(authUserId, id);
    }
);

export const unfriend = combineResolvers(
    isAuthenticated,
    (parent: any, { id }: any, { authUserId }: Context) =>
        User.unfriend(authUserId, id)
);

export const deleteUser = combineResolvers(
    isAuthenticated,
    (parent: any, args: any, { authUserId }: Context) => User.delete(authUserId)
);
