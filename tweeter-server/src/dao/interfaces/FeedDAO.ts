import { Status } from "tweeter-shared";
import { StatusPage } from "../../model/types/StatusPage";

export interface FeedDAO {
    addStatusToFeed(status: Status, followerHandle: string): Promise<void>;
    getFeed(handle: string, limit: number, lastKey?: any): Promise<StatusPage>;
}