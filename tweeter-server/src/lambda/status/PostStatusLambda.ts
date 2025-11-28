import { PostStatusRequest, PostStatusResponse, Status } from "tweeter-shared";
import { statusService } from "../../factory/serviceFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "us-east-2" });

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const status = Status.fromDto(request.status);

  if (!status) {
    return {
      success: false,
      message: "Invalid status",
    };
  }

  console.log("Adding to story...");
  await statusService.addToStory(request.token, status);
  console.log("Added to story successfully");

  const postQueueUrl = process.env.POST_QUEUE_URL!;
  console.log("PostQueue URL:", postQueueUrl);

  const message = {
    token: request.token,
    status: request.status,
    posterAlias: status?.user.alias,
  };

  console.log("Sending message to PostQueue...");
  try {
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: postQueueUrl,
        MessageBody: JSON.stringify(message),
      })
    );
    console.log("Message sent! MessageId:", result.MessageId);
  } catch (error) {
    console.error("Failed to send SQS message:", error);
    throw error;
  }

  return {
    success: true,
    message: null,
  };
};
