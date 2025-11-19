import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthRecord, AuthTokenDAO } from "../interfaces/AuthTokenDAO";

export class AuthTokenDAOAWS implements AuthTokenDAO {
  private readonly tableName = process.env.AUTH_TOKENS_TABLE!;
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  async getAuthToken(token: string): Promise<AuthRecord | null> {
    console.log("AUTH TOKEN VALUE:", JSON.stringify(token));
    console.log("AUTH TOKEN TYPE:", typeof token);
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );

    if (!result.Item) {
      return null;
    }

    return {
      token: result.Item.token,
      userAlias: result.Item.user_alias,
      timestamp: result.Item.timestamp,
    };
  }

  async createAuthToken(
    authtoken: AuthToken,
    userAlias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          token: authtoken.token,
          user_alias: userAlias,
          timestamp: authtoken.timestamp,
        },
      })
    );
  }

  async updateLastUsed(token: string, newTime: string): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { token },
        UpdateExpression: "SET #ts = :time",
        ExpressionAttributeNames: {
          "#ts": "timestamp",
        },
        ExpressionAttributeValues: {
          ":time": Number(newTime),
        },
      })
    );
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );
  }
}
