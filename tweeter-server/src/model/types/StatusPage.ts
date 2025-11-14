import { Status } from "tweeter-shared";

export interface StatusPage {
  items: Status[];
  lastKey?: any;
  hasMore: boolean;
}