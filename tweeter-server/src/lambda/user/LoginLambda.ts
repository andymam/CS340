import { LoginRequest, LoginResponse } from "tweeter-shared";
import { userService } from "../../factory/serviceFactory";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {

  try {
    const [user, authToken] = await userService.login(
      request.alias,
      request.password
    );

    return {
      success: true,
      message: null,
      user: user.dto,
      authToken: authToken,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? "Login failed",
      user: null,
      authToken: null,
    };
  }
};
