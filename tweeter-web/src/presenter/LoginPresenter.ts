import { To } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  setIsLoading: (loading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (to: To) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  public service: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.service = new UserService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.service.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
