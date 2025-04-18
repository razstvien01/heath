import {
  ConfirmOwnerReqDto,
  CreateOwnerReqDto,
  OwnerDto,
  OwnerFilterDto,
  UpdateOwnerReqDto,
} from "@/dto/owner";
import { FieldPacket, QueryResult } from "mysql2/promise";

export interface IOwnerRepository {
  addOwner(dto: CreateOwnerReqDto): Promise<[QueryResult, FieldPacket[]]>;
  confirmOwnerLogin(dto: ConfirmOwnerReqDto): Promise<boolean>;
  deleteOwnerFromManagementGuid(
    guid: string
  ): Promise<[QueryResult, FieldPacket[]] | null>;
  isOwnerGuid(guid: string): Promise<boolean>;
  getOwnerList(filters: OwnerFilterDto): Promise<OwnerDto[]>;
  getOwnerIdFromManagementGuid(guid: string): Promise<number | null>;
  updateOwner(dto: UpdateOwnerReqDto): Promise<[QueryResult, FieldPacket[]]>;
}
