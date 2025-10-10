import { To } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AuthView extends View {
  setIsLoading: (loading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (to: To) => void;
}

export class AuthPresenter<V extends AuthView> extends Presenter<V> {
  protected service: UserService;

  constructor(view: V) {
    super(view);
    this.service = new UserService();
  }

  protected async doAuthOperation(
    description: string,
    authOperation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    navigateAfter: (user: User) => void
  ) {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await authOperation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        navigateAfter(user);
      },
      description,
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
