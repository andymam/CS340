import { User } from "tweeter-shared";

export interface UsersDAO {
    getUser(handle: string): Promise<User>;
    createUser(user: User): Promise<void>;
}