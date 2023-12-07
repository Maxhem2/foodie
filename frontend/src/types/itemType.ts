import { UserSchema } from "./userType";

export type ItemSchema = {
    item_id: string;
    expireDate: Date;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    owner: UserSchema;
    tag?: string
};
