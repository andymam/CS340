import {
  FollowCountRequest,
  FollowCountResponse,
  UserDto,
} from "tweeter-shared";
import { followService } from "../../factory/serviceFactory";

export const handler = async (
  request: FollowCountRequest
): Promise<FollowCountResponse> => {

  const userDto: UserDto = {
    alias: request.userAlias,
    firstName: "",
    lastname: "",
    imageUrl: "",
  };

  const count = await followService.getFollowerCount(request.token, userDto);

  return {
    success: true,
    message: null,
    count,
  };
};
