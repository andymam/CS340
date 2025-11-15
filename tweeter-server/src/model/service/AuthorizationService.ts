import { AuthTokenDAO } from "../../dao/interfaces/AuthTokenDAO";

export class AuthorizationService {
  constructor(private authTokenDAO: AuthTokenDAO) {}

  public async authorize(token: string): Promise<void> {
    const authRecord = await this.authTokenDAO.getAuthToken(token);
    if (!authRecord) {
      throw new Error("Unauthorized");
    }
  }
}