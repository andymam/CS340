import { AuthToken, User } from "tweeter-shared";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { mock, instance, verify, anything } from "@typestrong/ts-mockito";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { UserEvent, userEvent } from "@testing-library/user-event";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockUser = mock<User>();
  const mockUserInstance = instance(mockUser);

  const mockAuthToken = mock<AuthToken>();
  const mockAuthTokenInstance = instance(mockAuthToken);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  test("both buttons are disabled when first rendered", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("Both buttons are enabled when the text field has text", async () => {
    const { user, postStatusButton, clearButton, postField } =
      renderPostStatusAndGetElement();

    await fillInPostField(user, postField);
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  async function fillInPostField(user: UserEvent, postField: HTMLElement) {
    await user.type(postField, "hi man");
  }

  test("Both buttons are disabled when the text field is cleared", async () => {
    const { user, postStatusButton, clearButton, postField } =
      renderPostStatusAndGetElement();

    await fillInPostField(user, postField);
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const post = "hi man";

    const { user, postStatusButton, clearButton, postField } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(postField, post);
    await user.click(postStatusButton);

    verify(
      mockPresenter.submitPost(
        anything(),
        post,
        mockUserInstance,
        mockAuthTokenInstance
      )
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByPlaceholderText(/What's on your mind/i);

  return { user, postStatusButton, clearButton, postField };
}
