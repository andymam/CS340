import { ExpirationState } from "@aws-sdk/client-s3";
import { AuthTokenDAO } from "../../dao/interfaces/AuthTokenDAO";

export class AuthorizationService {
  constructor(private authTokenDAO: AuthTokenDAO) {}

  public async authorize(token: string): Promise<string> {
    const authRecord = await this.authTokenDAO.getAuthToken(token);
    if (!authRecord) {
      throw new Error("Unauthorized");
    }

    const EXPIRATION_TIME = 30 * 60 * 1000;
    const now = Date.now();
    const timeSinceLastUsed = now - authRecord.timestamp;

    if (timeSinceLastUsed > EXPIRATION_TIME) {
      await this.authTokenDAO.deleteAuthToken(token);
      throw new Error("Token expired");
    }

    await this.authTokenDAO.updateLastUsed(token, now.toString());

    return authRecord.userAlias;
  }
}