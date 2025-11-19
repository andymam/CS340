import { AuthToken } from "tweeter-shared";

export interface AuthTokenDAO {
    getAuthToken(token: string): Promise<AuthRecord | null>;
    createAuthToken(authtoken: AuthToken, userAlias: string): Promise<void>;
    updateLastUsed(token: string, newTime: string): Promise<void>;
    deleteAuthToken(token: string): Promise<void>;
}

export interface AuthRecord {
    token: string;
    userAlias: string;
    timestamp: number;
}