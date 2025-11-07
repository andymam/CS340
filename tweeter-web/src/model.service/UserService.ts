import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";
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
      password
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
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }
}
