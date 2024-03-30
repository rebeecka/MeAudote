export type UserModelDb = {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    password: string | undefined;
    image?: string;
};

export type UserResponse = {
    id?: string;
    name: string;
    phone: string;
    email: string;
    password?: string;
    image?: string;
};