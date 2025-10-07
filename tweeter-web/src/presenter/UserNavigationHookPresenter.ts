import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";

export interface NavigationHookView {
  setDisplayedUser: (user: User) => void;
  navigate: (to: To) => void;
  displayErrorMessage: (message: string) => string;
}

export class UserNavigationHookPresenter {
  private service: UserService;
  private view: NavigationHookView;

  public constructor(view: NavigationHookView) {
    this.view = view;
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User | null,
    featurePath: string
  ): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.service.getUser(authToken!, await alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  public async extractAlias(value: string): Promise<string> {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
