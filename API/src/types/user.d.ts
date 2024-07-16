import { UserInstance as OriginalUserInstance } from '../models/user';

declare module '../models/user' {
    interface UserInstance {
        role: string;
        isBotanist: boolean;
        isAdmin: boolean;
        password: string;
    }
}
