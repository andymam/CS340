import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { mock, instance, verify } from "@typestrong/ts-mockito";
import { UserEvent, userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

describe("Login Component", () => {
  test("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  test("sign-in button enabled when both alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } = setup();

    await fillInAliasAndPassword(user, aliasField, passwordField);
    expect(signInButton).toBeEnabled();
  });

  async function fillInAliasAndPassword(
    user: UserEvent,
    aliasField: HTMLElement,
    passwordField: HTMLElement,
    alias: string = "a",
    password: string = "b"
  ) {
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
  }

  const setup = () => renderLoginAndGetElement("/");

  test("sign-in button is disabled is alias or password is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } = setup();
    await fillInAliasAndPassword(user, aliasField, passwordField);

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  test("calls the presenter's login method with the correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "myPassword";
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
