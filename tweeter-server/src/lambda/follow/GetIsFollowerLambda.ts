import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { followService } from "../../model/serviceFactory";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.userAlias,
    request.selectedUserAlias
  );

  return {
    success: true,
    message: null,
    isFollower,
  };
};
