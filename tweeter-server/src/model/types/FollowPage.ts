import { User } from "tweeter-shared";
import { FollowRecord } from "./FollowRecord";

export interface FollowPage {
  items: FollowRecord[];
  lastKey?: any;
  hasMore: boolean;
}