import "isomorphic-fetch";
import { StatusService } from "../src/model.service/StatusService";
import { AuthToken } from "tweeter-shared";

describe("status service test", () => {
  const statusService = new StatusService();

  test("loads more story items", async () => {
    const token = new AuthToken("234", Date.now());

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      token,
      "name",
      10,
      null
    );

    expect(Array.isArray(statuses)).toBe(true);

    if (statuses.length > 0) {
      const statusDto = statuses[0].dto;
      expect(statusDto).toHaveProperty("post");
      expect(statusDto).toHaveProperty("user");
      expect(statusDto.user).toHaveProperty("alias");
      expect(statusDto).toHaveProperty("timestamp");
      expect(statusDto).toHaveProperty("segments");
    }
    
    expect(typeof hasMore).toBe("boolean");
  });
});
