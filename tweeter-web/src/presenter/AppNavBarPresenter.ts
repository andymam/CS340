import { To } from "react-router-dom";
import { UserService } from "../model.service/UserService";
import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AppNavBarView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
  navigate: (to: To) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavBarView> {
  private service: UserService;

  public constructor(view: AppNavBarView) {
    super(view);
    this.service = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
