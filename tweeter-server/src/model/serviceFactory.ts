import { S3DAOAWS } from "../dao/dynamo/S3DAOAWS";
import { AuthorizationService } from "./service/AuthorizationService";
import { FollowService } from "./service/FollowService";
import { StatusService } from "./service/StatusService";
import { UserService } from "./service/UserService";


const usersDAO = new UsersDAOAWS();
const followDAO = new FollowDAOAWS();
const feedDAO = new FeedDAOAWS();
const storyDAO = new StoryDAOAWS();
const authTokenDAO = new AuthTokenDAOAWS();
const s3DAO = new S3DAOAWS();

const authorizationService = new AuthorizationService(authTokenDAO);

export const userService = new UserService(usersDAO, s3DAO, authorizationService, authTokenDAO);
export const followService = new FollowService(followDAO, authorizationService);
export const statusService = new StatusService(feedDAO, storyDAO, authorizationService);
