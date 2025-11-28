import { UserRecord, UsersDAO } from "../interfaces/UsersDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

export class UsersDAOAWS implements UsersDAO {
  private tableName = process.env.USERS_TABLE!;
  private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    async getUser(alias: string): Promise<UserRecord | null> {
    const result = await this.client.send(
        new GetCommand({
        TableName: this.tableName,
        Key: { alias },
        })
    );

    if (!result.Item) return null;

    return {
        alias: result.Item.alias,
        firstName: result.Item.firstName,
        lastName: result.Item.lastName,
        hashedPassword: result.Item.hashedPassword,
        imageUrl: result.Item.imageUrl ?? null,
    };
    }

    async createUser(user: UserRecord): Promise<void> {
    await this.client.send(
        new PutCommand({
        TableName: this.tableName,
        Item: {
            alias: user.alias,
            firstName: user.firstName,
            lastName: user.lastName,
            hashedPassword: user.hashedPassword,
            imageUrl: user.imageUrl ?? null,
            follower_count: 0,
            followee_count: 0,
        },
        })
    );
    }

}
