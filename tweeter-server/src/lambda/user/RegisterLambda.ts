import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { userService } from "../../factory/serviceFactory";

export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {

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