export type User = {
    disabled: boolean | null;
    email: string;
    first_name: string | null;
    last_name: string | null;
    user_id: string;
    username: string;
};

export type UserCreationInformation = {
    username: string;
    email: string;
    password: string;
};
