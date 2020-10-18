import { resources } from "@btdrawer/divelog-server-core";
const { USER, GROUP } = resources;

export const formatAuthPayload = (result: any): any => ({
    user: {
        id: result._id,
        name: result.name,
        username: result.username,
        email: result.email
    },
    token: result.token
});

export const convertStringToBase64 = (input: string): string =>
    Buffer.from(input).toString("base64");

export const convertBase64ToString = (input: string): string =>
    Buffer.from(input, "base64").toString("ascii");

export const generateUserHashKey = (userId: string): string =>
    `${USER}_${userId}`;

export const generateGroupHashKey = (groupId: string): string =>
    `${GROUP}_${groupId}`;
