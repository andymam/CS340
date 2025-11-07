import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  Status,
} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();

  const lastStatus: Status | null = Status.fromDto(request.lastItem);

  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    lastStatus
  );

  return {
    success: true,
    message: null,
    items: items.map((status) => status.dto),
    hasMore,
  };
};
