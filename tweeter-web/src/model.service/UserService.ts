import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const userDto = await this.serverFacade.getUser({
      token: authToken.token,
      alias: alias,
    });

    return User.fromDto(userDto);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));

    await this.serverFacade.logout({
      token: authToken.token,
    });
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const response = await this.serverFacade.login({
      alias,
      password,
    });

    if (!response.success || !response.user || !response.authToken) {
      throw new Error(response.message ?? "Login failed");
    }

    const user: User = User.fromDto(response.user)!;
    const authToken: AuthToken = response.authToken;

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const response = await this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      imageBase64,
      imageFileExtension,
    });

    if (!response.success || !response.user || !response.authToken) {
      throw new Error(response.message ?? "Registration failed");
    }

    const user: User = User.fromDto(response.user)!;
    const authToken: AuthToken = response.authToken;

    return [user, authToken];
  }
}
