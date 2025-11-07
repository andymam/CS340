import "isomorphic-fetch";
import { ServerFacade } from "../src/network/ServerFacade";
import { AuthToken } from "tweeter-shared";

describe("Serverfacade integration tests", () => {
  const serverFacade = new ServerFacade();

  test("register returns a user and an authtoken", async () => {
    const response = await serverFacade.register({
      firstName: "Puff",
      lastName: "Daddy",
      alias: `test${Date.now()}`,
      password: "password123",
      imageBase64: "",
      imageFileExtension: "png",
    });

    const { user, authToken } = response;

    expect(user).toBeDefined();
    expect(user!.alias).toBeTruthy();
    expect(authToken).toBeDefined();
  });

  test("getFollowers returns an list of followers", async () => {
    const token = new AuthToken("123", Date.now());

    const request = {
      token: token.token,
      userAlias: "name",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    if (followers.length > 0) {
      const followerDto = followers[0].dto;
      expect(followerDto).toHaveProperty("alias");
      expect(followerDto.alias).toBeTruthy();
    }

    expect(typeof hasMore).toBe("boolean");
  });

  test("GetFollowerCount returns a count", async () => {
    const token = new AuthToken("123", Date.now());
    const count = await serverFacade.getFollowerCount({
      token: token.token,
      userAlias: "name",
    });

    expect(typeof count).toBe("number");
  });
});
