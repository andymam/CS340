import {
  FollowCountRequest,
  FollowCountResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {
  const followService = new FollowService();

  const userDto: UserDto = {
    alias: request.userAlias,
    firstName: "",
    lastname: "",
    imageUrl: "",
  };

  const count = await followService.getFolloweeCount(request.token, userDto);

  return {
    success: true,
    message: null,
    count,
  };
};
