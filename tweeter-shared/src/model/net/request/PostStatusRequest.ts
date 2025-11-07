import { StatusDto } from "../../dto/StatusDto";

export interface PostStatusRequest {
  token: string;
  status: StatusDto;
}
