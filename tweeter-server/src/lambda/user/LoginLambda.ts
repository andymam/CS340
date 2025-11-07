import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const userService = new UserService();

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
