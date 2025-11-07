export interface FollowActionRequest {
    token: string;
    userAlias: string;
    action: "follow" | "unfollow";
}