import { StatusDto } from "../../dto/StatusDto";

export interface PagedStatusItemRequest {
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
}