import { Status } from "tweeter-shared";
import { StatusPage } from "../../model/types/StatusPage";

export interface StoryDAO {
    addStatus(status: Status): Promise<void>;
    getStory(handle: string, limit: number, lastKey?: any): Promise<StatusPage>;
}