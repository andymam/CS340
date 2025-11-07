import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {
    const userService = new UserService();

    try {
        const [user, authToken] = await userService.register(
            request.firstName,
            request.lastName,
            request.alias,
            request.password,
            Uint8Array.from(Buffer.from(request.imageBase64, "base64")),
            request.imageFileExtension
        );

        return {
            success: true,
            message: null,
            user: user.dto,
            authToken
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message
        };
    }
}