import { To } from "react-router-dom";
import { UserService } from "../model.service/UserService";
import { AuthToken } from "tweeter-shared";

export interface AppNavBarView {
    displayInfoMessage: (message: string, duration: number) => string;
    displayErrorMessage: (message: string) => void;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
    navigate: (to: To) => void;
}

export class AppNavbarPresenter {
    private view: AppNavBarView;
    private service: UserService;

    public constructor(view: AppNavBarView) {
        this.view = view;
        this.service = new UserService();
    }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };
}
