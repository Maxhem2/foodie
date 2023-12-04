import { User } from "./userType";

export type Item = {
    item_id: string;
    expireDate: Date;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    owner: User;
};
