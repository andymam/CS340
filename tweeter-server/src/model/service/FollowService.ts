import { User, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { FollowDAO } from "../../dao/interfaces/FollowDAO";
import { AuthorizationService } from "./AuthorizationService";
import { AbstractDAOFactory } from "../../factory/AbstractDAOFactory";

export class FollowService implements Service {
  private usersDAO: UsersDAO;
  private followDAO: FollowDAO;
  private authorizationService: AuthorizationService;

  constructor(daoFactory: AbstractDAOFactory) {
    this.usersDAO = daoFactory.getUsersDAO();
    this.followDAO = daoFactory.getFollowDAO();
    const authTokenDAO = daoFactory.getAuthTokenDAO();
    this.authorizationService = new AuthorizationService(authTokenDAO);
  }

  public async getFollowerAliases(
    userAlias: string,
    pageSize: number,
    lastKey?: any
  ): Promise<[string[], boolean, any]> {
    const [followRecords, hasMore, newLastKey] = await this.followDAO.getFollowersPage(
      userAlias,
      pageSize,
      lastKey
    );

    const followerAliases = followRecords.map(record => record.follower_handle);

    return [followerAliases, hasMore, newLastKey];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const followeesPage = await this.followDAO.getFollowees(
      userAlias,
      pageSize,
      lastItem ?? undefined
    );

    const followeeDtos: UserDto[] = await Promise.all(
      followeesPage.items.map(async (record) => {
        const followeeRecord = await this.usersDAO.getUser(
          record.followee_handle
        );
        if (!followeeRecord) throw new Error("Followee not found");

        const followee = new User(
          followeeRecord.firstName,
          followeeRecord.lastName,
          followeeRecord.alias,
          followeeRecord.imageUrl ?? null
        );

        return followee.dto;
      })
    );

    return [followeeDtos, followeesPage.hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const followersPage = await this.followDAO.getFollowers(
      userAlias,
      pageSize,
      lastItem ?? undefined
    );

    const followerDtos: UserDto[] = await Promise.all(
      followersPage.items.map(async (record) => {
        const followerRecord = await this.usersDAO.getUser(
          record.follower_handle
        );
        if (!followerRecord) throw new Error("Follower not found");

        const follower = new User(
          followerRecord.firstName,
          followerRecord.lastName,
          followerRecord.alias,
          followerRecord.imageUrl ?? null
        );

        return follower.dto;
      })
    );

    return [followerDtos, followersPage.hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const currentUserAlias = await this.authorizationService.authorize(token);

    const pageSize = 1000;
    const followeesPage = await this.followDAO.getFollowees(
      currentUserAlias,
      pageSize
    );

    return followeesPage.items.some(
      (record) => record.followee_handle === selectedUserAlias
    );
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);
    const count = await this.followDAO.getFolloweeCount(user.alias);
    return count;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    await this.authorizationService.authorize(token);
    const count = await this.followDAO.getFollowerCount(user.alias);
    return count;
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authorizationService.authorize(token);

    await this.followDAO.follow(currentUserAlias, userToFollow.alias);

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentUserAlias = await this.authorizationService.authorize(token);

    await this.followDAO.unfollow(currentUserAlias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
