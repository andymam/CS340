import {
  FollowActionRequest,
  FollowActionResponse,
  FollowCountRequest,
  FollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://k3j8n26lel.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/status");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return response.isFollower;
  }

  public async getFolloweeCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/followee/count");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return response.count;
  }

  public async getFollowerCount(request: FollowCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follower/count");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return response.count;
  }

  public async follow(request: FollowActionRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/follow");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(
    request: FollowActionRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowActionRequest,
      FollowActionResponse
    >(request, "/unfollow");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    return [response.followerCount, response.followeeCount];
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    const items =
      response.items?.map((dto) => Status.fromDto(dto) as Status) ?? [];
    return [items, response.hasMore];
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    const items =
      response.items?.map((dto) => Status.fromDto(dto) as Status) ?? [];
    return [items, response.hasMore];
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post");

    if (!response.success) {
      throw new Error(response.message ?? undefined);
    }
  }

  public async getUser(request: GetUserRequest): Promise<UserDto | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (!response.success) {
      throw new Error(response.message ?? undefined);
    }

    return response.user;
  }

  public async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/logout");

    if (!response.success) {
      throw new Error(response.message ?? undefined);
    }

    return response;
  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/login");

    if (!response.success) {
      throw new Error(response.message ?? undefined);
    }

    return response;
  }

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    return await this.clientCommunicator.doPost<RegisterRequest, RegisterResponse>(
      request,
      "/user/register"
    );
  }
}
