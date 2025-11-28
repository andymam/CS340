import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowPage } from "../../model/types/FollowPage";
import { FollowDAO } from "../interfaces/FollowDAO";
import { FollowRecord } from "../../model/types/FollowRecord";

export class FollowDAOAWS implements FollowDAO {
  private readonly followsTableName = process.env.FOLLOW_TABLE!;
  private readonly usersTableName = process.env.USERS_TABLE!;
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  async follow(follower: string, followee: string): Promise<void> {
    // add follow relationship
    await this.client.send(
      new PutCommand({
        TableName: this.followsTableName,
        Item: {
          follower_handle: follower,
          followee_handle: followee,
        },
      })
    );

    // increment follower's followee count
    await this.client.send(
      new UpdateCommand({
        TableName: this.usersTableName,
        Key: { alias: follower },
        UpdateExpression: "ADD followee_count :inc",
        ExpressionAttributeValues: { ":inc": 1 },
      })
    );

    // increment followee's follower count
    await this.client.send(
      new UpdateCommand({
        TableName: this.usersTableName,
        Key: { alias: followee },
        UpdateExpression: "ADD follower_count :inc",
        ExpressionAttributeValues: { ":inc": 1 },
      })
    );
  }

  async unfollow(follower: string, followee: string): Promise<void> {
    // delete follow relationship
    await this.client.send(
      new DeleteCommand({
        TableName: this.followsTableName,
        Key: {
          follower_handle: follower,
          followee_handle: followee,
        },
      })
    );

    // decrement follower's followee count
    await this.client.send(
      new UpdateCommand({
        TableName: this.usersTableName,
        Key: { alias: follower },
        UpdateExpression: "ADD followee_count :dec",
        ExpressionAttributeValues: { ":dec": -1 },
      })
    );

    // decrement followee's follower count
    await this.client.send(
      new UpdateCommand({
        TableName: this.usersTableName,
        Key: { alias: followee },
        UpdateExpression: "ADD follower_count :dec",
        ExpressionAttributeValues: { ":dec": -1 },
      })
    );
  }

  async getFollowers(
    handle: string,
    limit: number,
    lastKey?: any
  ): Promise<FollowPage> {
    let exclusiveStartKey = undefined;
    if (lastKey) {
      exclusiveStartKey = {
        followee_handle: lastKey.followee_handle || handle,
        follower_handle: lastKey.follower_handle || lastKey.alias,
      };
    }

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.followsTableName,
        IndexName: "follow_index",
        KeyConditionExpression: "followee_handle = :handle",
        ExpressionAttributeValues: {
          ":handle": handle,
        },
        Limit: limit,
        ExclusiveStartKey: exclusiveStartKey,
      })
    );

    const items = (result.Items ?? []).map((item) => ({
      follower_handle: item.follower_handle,
      followee_handle: item.followee_handle,
    }));

    return {
      items,
      lastKey: result.LastEvaluatedKey,
      hasMore: !!result.LastEvaluatedKey,
    };
  }

  async getFollowees(
    handle: string,
    limit: number,
    lastKey?: any
  ): Promise<FollowPage> {
    let exclusiveStartKey = undefined;
    if (lastKey) {
      exclusiveStartKey = {
        followee_handle: lastKey.followee_handle || handle,
        follower_handle: lastKey.follower_handle || lastKey.alias,
      };
    }

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.followsTableName,
        KeyConditionExpression: "follower_handle = :handle",
        ExpressionAttributeValues: {
          ":handle": handle,
        },
        Limit: limit,
        ExclusiveStartKey: exclusiveStartKey,
      })
    );

    const items = (result.Items ?? []).map((item) => ({
      follower_handle: item.follower_handle,
      followee_handle: item.followee_handle,
    }));

    return {
      items,
      lastKey: result.LastEvaluatedKey,
      hasMore: !!result.LastEvaluatedKey,
    };
  }

  async getFollowerCount(handle: string): Promise<number> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.usersTableName,
        Key: { alias: handle },
        ProjectionExpression: "follower_count",
      })
    );

    return result.Item?.follower_count ?? 0;
  }

  async getFolloweeCount(handle: string): Promise<number> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.usersTableName,
        Key: { alias: handle },
        ProjectionExpression: "followee_count",
      })
    );

    return result.Item?.followee_count ?? 0;
  }

  async getFollowersPage(
    followeeAlias: string,
    pageSize: number,
    lastKey?: any
  ): Promise<[FollowRecord[], boolean, any]> {
    let exclusiveStartKey = undefined;
    if (lastKey) {
      exclusiveStartKey = {
        followee_handle: lastKey.followee_handle || followeeAlias,
        follower_handle: lastKey.follower_handle || lastKey.alias,
      };
    }

    const result = await this.client.send(
      new QueryCommand({
        TableName: this.followsTableName,
        IndexName: "follow_index",
        KeyConditionExpression: "followee_handle = :handle",
        ExpressionAttributeValues: {
          ":handle": followeeAlias,
        },
        Limit: pageSize,
        ExclusiveStartKey: exclusiveStartKey,
      })
    );

    const records = (result.Items ?? []).map((item) => ({
      follower_handle: item.follower_handle,
      followee_handle: item.followee_handle,
    }));

    return [records, !!result.LastEvaluatedKey, result.LastEvaluatedKey];
  }
}
