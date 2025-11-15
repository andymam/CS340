
export interface UsersDAO {
    getUser(handle: string): Promise<UserRecord | null>;
    createUser(user: UserRecord): Promise<void>;
}

export interface UserRecord {
  alias: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  hashedPassword: string;
}