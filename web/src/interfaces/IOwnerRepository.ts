import {
  ConfirmOwnerReqDto,
  CreateOwnerReqDto,
  OwnerCountFilterDto,
  OwnerDto,
  OwnerFilterDto,
  UpdateOwnerReqDto,
} from "@/dto/owner";
import { FieldPacket, QueryResult } from "mysql2/promise";

export interface IOwnerRepository {
  addOwner(dto: CreateOwnerReqDto): Promise<[QueryResult, FieldPacket[]]>;
  checkOwnerIfExist(name: string): Promise<boolean>;
  confirmOwnerLogin(dto: ConfirmOwnerReqDto): Promise<boolean>;
  deleteOwnerFromManagementGuid(
    guid: string
  ): Promise<[QueryResult, FieldPacket[]]>;
  isOwnerGuid(guid: string): Promise<boolean>;
  getOwnerList(filters: OwnerFilterDto): Promise<OwnerDto[]>;
  getOwnerTotalCount(filters: OwnerCountFilterDto): Promise<number>;
  getOwnerIdFromManagementGuid(guid: string): Promise<number | null>;
  updateOwner(dto: UpdateOwnerReqDto): Promise<[QueryResult, FieldPacket[]]>;
}
