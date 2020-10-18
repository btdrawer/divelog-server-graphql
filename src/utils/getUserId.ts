import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

type JwtOutput = {
    id: string;
};

const getHeader = (req: any): string =>
    req.connection
        ? req.connection.context.Authorization
        : req.req.headers.authorization;

const getAuthData = (req: any): JwtOutput | null => {
    if (req) {
        const header = getHeader(req);
        if (header) {
            const token = header.replace("Bearer ", "");
            const data = jwt.verify(token, <string>process.env.JWT_KEY);
            return <JwtOutput>data;
        }
    }
    return null;
};

const getUserId = (req: any): string | null => {
    const authData = getAuthData(req);
    return authData ? authData.id : null;
};

export default getUserId;
