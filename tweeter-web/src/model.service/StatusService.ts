import { AuthToken, Status, FakeData, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.getMoreStoryItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    await this.serverFacade.postStatus({
      token: authToken.token,
      status: newStatus.dto,
    });
  }
}
