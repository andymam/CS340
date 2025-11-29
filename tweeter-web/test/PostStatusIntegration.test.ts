import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../src/presenter/PostStatusPresenter";
import { StatusService } from "../src/model.service/StatusService";
import { ServerFacade } from "../src/network/ServerFacade";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import "isomorphic-fetch";


describe("PostStatus Integration Test", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let serverFacade: ServerFacade;
  let authToken: AuthToken;
  let currentUser: User;
  let testPost: string;

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    
    const loginResponse = await serverFacade.login({
      alias: "@daisy",
      password: "a",
    });

    authToken = loginResponse.authToken!;
    currentUser = User.fromDto(loginResponse.user!)!;
  });

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);
    
    when(mockView.displayInfoMessage(anything(), 0)).thenReturn("testToastId");
    
    presenter = new PostStatusPresenter(mockViewInstance);
    
    testPost = `Integration test post at ${Date.now()}`;
  });

  test("post a status and verify it appears in story", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    // send ppost
    await presenter.submitPost(mockEvent, testPost, currentUser, authToken);

    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

    const statusService = new StatusService();
    // get post
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      currentUser.alias,
      10,
      null
    );

    // has status
    expect(storyItems.length).toBeGreaterThan(0);
    
    const mostRecentStatus = storyItems[0];
    
    // status details are correct
    expect(mostRecentStatus.post).toBe(testPost);
    expect(mostRecentStatus.user.alias).toBe(currentUser.alias);
    expect(mostRecentStatus.user.firstName).toBe(currentUser.firstName);
    expect(mostRecentStatus.user.lastName).toBe(currentUser.lastName);
  });
});