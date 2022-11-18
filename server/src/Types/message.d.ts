import { User } from './user';

export type CreateMessage = {
    to: User['username'];
    from: User['username'];
    fetchedAt?: string;
    readAt?: string;
    read: boolean;
}

export type Message = CreateMessage & {
    id: number;
    createdAt: string;
};