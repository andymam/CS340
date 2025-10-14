import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  setIsFollower: (value: React.SetStateAction<boolean>) => void;
  setFolloweeCount: (value: React.SetStateAction<number>) => void;
  setFollowerCount: (value: React.SetStateAction<number>) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User | null
  ): Promise<void> {
    await this.handleFollow(
      event,
      authToken,
      displayedUser,
      "follow user",
      "Following",
      () => this.service.follow(authToken!, displayedUser!),
      true
    );
  }

  public async handleFollow(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User | null,
    actionDescription: string,
    toastDescription: string,
    followOperation: () => Promise<[number, number]>,
    isFollowerAfter: boolean
  ) {
    event.preventDefault();
    var toast = "";

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        toast = this.view.displayInfoMessage(
          `${toastDescription} ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await followOperation();

        this.view.setIsFollower(isFollowerAfter);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
      },
      actionDescription,
      () => {
        this.view.deleteMessage(toast);
        this.view.setIsLoading(false);
      }
    );
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User | null
  ): Promise<void> {
    await this.handleFollow(
      event,
      authToken,
      displayedUser,
      "unfollow user",
      "Unfollowing",
      () => this.service.unfollow(authToken!, displayedUser!),
      false
    );
  }
}
