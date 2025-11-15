import { PostStatusRequest, PostStatusResponse, Status } from "tweeter-shared";
import { statusService } from "../../model/serviceFactory";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {

    await statusService.postStatus(
        request.token,
        Status.fromDto(request.status)!
    );

  return {
    success: true,
    message: null,
  };
};