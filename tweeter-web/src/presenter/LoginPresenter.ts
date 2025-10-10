import { User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string | undefined
  ) {
    await this.doAuthOperation(
      "log user in",
      () => this.service.login(alias, password),
      rememberMe,
      (user: User) => {
        if (originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      }
    );
  }
}
