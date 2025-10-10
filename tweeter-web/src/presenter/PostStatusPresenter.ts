import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  setPost: (value: React.SetStateAction<string>) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(
    event: React.MouseEvent,
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    event.preventDefault();

    var postingStatusToastId = "";

    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0
        );

        const status = new Status(post, currentUser!, Date.now());

        await this.service.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      }
    );
  }
}
