import { User } from "./user";

export type Registration = {
    id?: number;
    userId?: User['id'];
    deviceId: string;
};