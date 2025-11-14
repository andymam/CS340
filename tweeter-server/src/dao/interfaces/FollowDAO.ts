import { FollowPage } from "../../model/types/FollowPage";

export interface FollowDAO {
  follow(follower: string, followee: string): Promise<void>;
  unfollow(follower: string, followee: string): Promise<void>;
  getFollowers(handle: string, limit: number, lastKey?: any): Promise<FollowPage>;
  getFollowees(handle: string, limit: number, lastKey?: any): Promise<FollowPage>;
  getFollowerCount(handle: string): Promise<number>;
  getFolloweeCount(handle: string): Promise<number>;
}