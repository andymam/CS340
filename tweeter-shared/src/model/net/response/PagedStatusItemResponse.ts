import { TweeterResponse } from "./TweeterResponse";
import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemResponse extends TweeterResponse {
    items: StatusDto[];
    hasMore: boolean;
}
