import { Registration } from "./registration";

export type CreateMessage = {
    to: string;
    from: string;
    message: string;
    fetchedAt?: string;
    readAt?: string;
    read?: boolean = false;
}

export type Message = CreateMessage & {
    id: number;
    createdAt: string;
};