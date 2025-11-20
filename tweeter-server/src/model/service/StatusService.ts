import { Status, User } from "tweeter-shared";
import { Service } from "./Service";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { AuthorizationService } from "./AuthorizationService";
import { FeedDAO } from "../../dao/interfaces/FeedDAO";
import { StoryDAO } from "../../dao/interfaces/StoryDAO";
import { FollowDAO } from "../../dao/interfaces/FollowDAO";

export class StatusService implements Service {
  constructor(
    private usersDAO: UsersDAO,
    private feedDAO: FeedDAO,
    private storyDAO: StoryDAO,
    private followDAO: FollowDAO,
    private authorizationService: AuthorizationService,
  ) {}

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authorizationService.authorize(token);

    const userRecord = await this.usersDAO.getUser(userAlias);
    if (!userRecord) {
      throw new Error(`User ${userAlias} not found`);
    }

    const [statusRecords, hasMore] = await this.feedDAO.getFeedPage(
      userAlias,
      pageSize,
      lastItem
    );

    const statuses = await Promise.all(
      statusRecords.map(async (record) => {
        const userRecord = await this.usersDAO.getUser(record.alias);
        if (!userRecord) throw new Error("User not found");

        const user = new User(
          userRecord.firstName,
          userRecord.lastName,
          userRecord.alias,
          userRecord.imageUrl ?? null
        );

        return new Status(record.post, user, record.timestamp);
      })
    );

    return [statuses, hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    await this.authorizationService.authorize(token);

    const userRecord = await this.usersDAO.getUser(userAlias);
    if (!userRecord) {
      throw new Error(`User ${userAlias} not found`);
    }

    const [statusRecords, hasMore] = await this.storyDAO.getStoryPage(
      userAlias,
      pageSize,
      lastItem
    );

    const statuses = await Promise.all(
      statusRecords.map(async (record) => {
        const userRecord = await this.usersDAO.getUser(record.alias);
        if (!userRecord) throw new Error("User not found");

        const user = new User(
          userRecord.firstName,
          userRecord.lastName,
          userRecord.alias,
          userRecord.imageUrl ?? null
        );

        return new Status(record.post, user, record.timestamp);
      })
    );

    return [statuses, hasMore];
  }

  public async postStatus(token: string, newStatus: Status): Promise<void> {
    await this.authorizationService.authorize(token);

    const posterHandle = newStatus.user.alias;
    console.log("Posting status for:", posterHandle);

    await this.storyDAO.addStatus(newStatus);
    console.log("Added to story");

    const followerPage = await this.followDAO.getFollowers(posterHandle, 1000);
    console.log("Found followers:", followerPage.items);
    const followerAliases = followerPage.items.map(
      (record) => record.follower_handle
    );
    console.log("Follower aliases:", followerAliases);

    await Promise.all(
      followerAliases.map((alias: string) =>
        this.feedDAO.addStatusToFeed(newStatus, alias)
      )
    );
    console.log("Added to all feeds");
  }
}
