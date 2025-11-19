import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { S3DAO } from "../../dao/interfaces/S3DAO";
import { AuthorizationService } from "./AuthorizationService";
import { AuthTokenDAO } from "../../dao/interfaces/AuthTokenDAO";
import bcrypt from "bcryptjs";
import crypto from "crypto";

interface UserWithPassword extends User {
  hashedPassword: string;
}

export class UserService implements Service {
  constructor(
    private usersDAO: UsersDAO,
    private s3DAO: S3DAO,
    private authorizationService: AuthorizationService,
    private authTokenDAO: AuthTokenDAO
  ) {}

  public async getUser(token: string, alias: string): Promise<User | null> {
    await this.authorizationService.authorize(token);
    
    const userRecord = await this.usersDAO.getUser(alias);
    if (!userRecord) {
      return null;
    }

    const user = new User(
      userRecord.firstName,
      userRecord.lastName,
      userRecord.alias,
      userRecord.imageUrl ?? null
    );

    return user
  }

  public async logout(token: string): Promise<void> {
    await this.authorizationService.authorize(token);
    await this.authTokenDAO.deleteAuthToken(token);

    await new Promise((res) => setTimeout(res, 1000));
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const userRecord = await this.usersDAO.getUser(alias);
    if (!userRecord) {
      throw new Error("Invalid alias or password");
    }

    const passwordMatches = await bcrypt.compare(password, userRecord.hashedPassword);
    if (!passwordMatches) throw new Error("Invalid alias or password");

    const user = new User(
      userRecord.firstName,
      userRecord.lastName,
      userRecord.alias,
      userRecord.imageUrl
    );

    const timestamp = Date.now();
    const tokenValue = crypto.randomUUID();
    const authToken = new AuthToken(tokenValue, timestamp);

    await this.authTokenDAO.createAuthToken(authToken, alias);


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
    const hashedPassword = await bcrypt.hash(password, 10);

    const imageBuffer = Buffer.from(userImageBytes);
    const imageKey = `${alias}.${imageFileExtension}`;
    const imageUrl = await this.s3DAO.uploadImage(imageKey, imageBuffer);

    const newUser = new User(firstName, lastName, alias, imageUrl);

    await this.usersDAO.createUser({
      alias,
      firstName,
      lastName,
      imageUrl,
      hashedPassword
    });

    const timestamp = Date.now();
    const tokenValue = crypto.randomUUID();
    const authToken = new AuthToken(tokenValue, timestamp);
    await this.authTokenDAO.createAuthToken(authToken, alias);

    return [newUser, authToken];
  }
}
