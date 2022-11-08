import { HostMachines } from "./enums";

export type CreateMessage = {
    to: string;
    from: string;
    sentDate: string;
    read: boolean;
}

export type Message = CreateMessage & {
    id: number;
};

export type MessageBody = CreateMessage;