import {
  FollowActionRequest,
  FollowActionResponse,
  UserDto,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {
  const followService = new FollowService();

  const userDto: UserDto = {
    alias: request.userAlias,
    firstName: "",
    lastname: "",
    imageUrl: "",
  };

  const [followerCount, followeeCount] = await followService.follow(request.token, userDto);


  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
