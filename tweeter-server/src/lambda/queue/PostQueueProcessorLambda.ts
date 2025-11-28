import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { followService } from "../../factory/serviceFactory";

const sqsClient = new SQSClient({ region: "us-east-2" });

export const handler = async (event: SQSEvent) => {
  const jobQueueUrl = process.env.JOB_QUEUE_URL!;

  for (const record of event.Records) {
    const { status, posterAlias } = JSON.parse(record.body);
    
    console.log(`Processing post from ${posterAlias}`);
    
    const allFollowers: string[] = [];
    let hasMore = true;
    let lastKey = undefined;
    
    while (hasMore) {
      const [followers, more, nextKey] = await followService.getFollowerAliases(
        posterAlias, 
        1000, 
        lastKey
      );
      allFollowers.push(...followers);
      hasMore = more;
      lastKey = nextKey;
    }
    
    console.log(`Found ${allFollowers.length} followers`);
    
    const batches = chunkArray(allFollowers, 25);
    
    for (const batch of batches) {
      const jobMessage = {
        status: status,
        followerBatch: batch
      };
      
      await sqsClient.send(new SendMessageCommand({
        QueueUrl: jobQueueUrl,
        MessageBody: JSON.stringify(jobMessage)
      }));
    }
    
    console.log(`Sent ${batches.length} batches to JobQueue`);
  }
};

function chunkArray(array: any[], size: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}