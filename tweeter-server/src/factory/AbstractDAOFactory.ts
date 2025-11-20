import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";
import { FollowDAO } from "../dao/interfaces/FollowDAO";
import { S3DAO } from "../dao/interfaces/S3DAO";
import { StoryDAO } from "../dao/interfaces/StoryDAO";
import { UsersDAO } from "../dao/interfaces/UsersDAO";

export abstract class AbstractDAOFactory {
    abstract getUsersDAO(): UsersDAO;
    abstract getFollowDAO(): FollowDAO;
    abstract getFeedDAO(): FeedDAO;
    abstract getStoryDAO(): StoryDAO;
    abstract getAuthTokenDAO(): AuthTokenDAO;
    abstract getS3DAO(): S3DAO;
}