import { SQSEvent } from "aws-lambda";
import { Status } from "tweeter-shared";
import { feedDAO } from "../../factory/serviceFactory";

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    // console.log("Raw record body:", record.body);
    
    const parsed = JSON.parse(record.body);
    // console.log("Parsed data:", JSON.stringify(parsed));
    
    const { status, followerBatch } = parsed;
    
    // console.log("Status:", status);
    // console.log("Follower batch:", followerBatch);
    
    if (!followerBatch || followerBatch.length === 0) {
      console.log("No followers in batch, skipping");
      continue;
    }
    
    // console.log(`Updating feeds for ${followerBatch.length} followers`);
    
    const statusObj = Status.fromDto(status)!;
    
    await feedDAO.batchAddToFeeds(statusObj, followerBatch);
    
    // console.log("Feeds updated successfully");
  }
};