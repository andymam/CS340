import {
  FollowActionRequest,
  FollowActionResponse,
  UserDto,
} from "tweeter-shared";
import { followService } from "../../factory/serviceFactory";

export const handler = async (
  request: FollowActionRequest
): Promise<FollowActionResponse> => {

  const userDto: UserDto = {
    alias: request.userAlias,
    firstName: "",
    lastname: "",
    imageUrl: "",
  };

  const [followerCount, followeeCount] = await followService.unfollow(request.token, userDto);


  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
