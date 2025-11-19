import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { StatusRecord, StoryDAO } from "../interfaces/StoryDAO";
import { Status, User } from "tweeter-shared";
import { StatusPage } from "../../model/types/StatusPage";

export class StoryDAOAWS implements StoryDAO {
  private tableName = process.env.STORY_TABLE!;
  private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  async addStatus(status: Status): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          author_alias: status.user.alias,
          time_stamp: status.timestamp,
          post: status.post,
        },
      })
    );
  }

  async getStory(
    handle: string,
    limit: number,
    lastKey?: any
  ): Promise<StatusPage> {
    const [records, hasMore, newLastKey] = await this.getStoryPage(
      handle,
      limit,
      lastKey ?? undefined
    );

    const items: Status[] = records.map(
      (rec) =>
        new Status(rec.post, new User(rec.alias, "", "", ""), rec.timestamp)
    );

    return {
      items,
      lastKey: newLastKey,
      hasMore,
    };
  }

  async getStoryPage(
    userAlias: string,
    pageSize: number,
    lastItem: any
  ): Promise<[StatusRecord[], boolean, any]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "author_alias = :alias",
        ExpressionAttributeValues: {
          ":alias": { S: userAlias },
        },
        Limit: pageSize,
        ExclusiveStartKey: lastItem,
        ScanIndexForward: false,
      })
    );

    const records: StatusRecord[] = (result.Items ?? []).map((item) => ({
      alias: item.author_alias?.S ?? "",
      post: item.post?.S ?? "",
      timestamp: Number(item.time_stamp?.N ?? 0),
    }));

    const hasMore = !!result.LastEvaluatedKey;

    return [records, hasMore, result.LastEvaluatedKey];
  }
}
