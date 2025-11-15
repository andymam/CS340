import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { userService } from "../../model/serviceFactory";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {

  await userService.logout(request.token);

  return {
    success: true,
    message: null,
  };
};
