import { Club } from "@btdrawer/divelog-server-core";
import { Context, GearTypeDef, UserTypeDef } from "../../types";

export const email = (
    { id, email }: UserTypeDef,
    args: any,
    context: Context
) => (context.authUserId && context.authUserId === id ? email : null);

export const dives = ({ dives }: UserTypeDef, args: any, context: Context) =>
    dives.map(async (dive: any) =>
        context.loaders.diveLoader.load(dive.toString())
    );

export const clubs = async ({ clubs }: UserTypeDef) => {
    const [manager, member] = await Promise.all([
        Club.find({
            _id: {
                $in: clubs.manager
            }
        }),
        Club.find({
            _id: {
                $in: clubs.member
            }
        })
    ]);
    return {
        manager,
        member
    };
};

export const gear = (
    { id, gear }: UserTypeDef,
    args: any,
    { authUserId, loaders }: Context
) =>
    authUserId && authUserId === id
        ? gear.map((g: GearTypeDef) => loaders.gearLoader.load(g.id))
        : null;

export const friends = (
    { id, friends }: UserTypeDef,
    args: any,
    { authUserId, loaders }: Context
) =>
    authUserId && authUserId === id
        ? friends.map((friend: any) =>
              loaders.userLoader.load(friend.toString())
          )
        : null;

export const friendRequests = async (
    { id, friendRequests }: UserTypeDef,
    args: any,
    { authUserId, loaders }: Context
) => {
    if (authUserId && authUserId === id) {
        const [inbox, sent] = await Promise.all([
            friendRequests.inbox.map((request: any) =>
                loaders.userLoader.load(request.toString())
            ),
            friendRequests.sent.map((request: any) =>
                loaders.userLoader.load(request.toString())
            )
        ]);
        return {
            inbox,
            sent
        };
    }
    return null;
};
