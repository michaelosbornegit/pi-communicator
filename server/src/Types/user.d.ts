export type CreateUser = {
    username: string;
}

export type User = CreateUser & {
    id: string;
    createdAt: string;
}