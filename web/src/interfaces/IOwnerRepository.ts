import { OwnerDto, OwnerFilterDto } from "@/dto/owner";
import { FieldPacket, QueryResult } from "mysql2/promise";

export interface IOwnerRepository {
  addOwner(
    username: string,
    password: string
  ): Promise<[QueryResult, FieldPacket[]]>;

  confirmOwnerLogin(
    guid: string,
    username: string,
    password: string
  ): Promise<boolean>;

  deleteOwnerFromManagementGuid(
    guid: string
  ): Promise<[QueryResult, FieldPacket[]] | null>;

  isOwnerGuid(guid: string): Promise<boolean>;
  getOwnerList(filters: OwnerFilterDto): Promise<OwnerDto[]>;

  getOwnerIdFromManagementGuid(guid: string): Promise<number | boolean>;
  updateOwner(
    username: string,
    password: string,
    guid: string
  ): Promise<[QueryResult, FieldPacket[]]>;
}
