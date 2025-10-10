import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { To } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface NavigationHookView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (to: To) => void;
}

export class UserNavigationHookPresenter extends Presenter<NavigationHookView> {
  private service: UserService;

  public constructor(view: NavigationHookView) {
    super(view);
    this.service = new UserService();
  }

  public async navigateToUser(
    event: React.MouseEvent,
    authToken: AuthToken,
    displayedUser: User | null,
    featurePath: string
  ): Promise<void> {
    event.preventDefault();

    await this.doFailureReportingOperation(async() => {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.service.getUser(authToken!, await alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }

  public async extractAlias(value: string): Promise<string> {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
