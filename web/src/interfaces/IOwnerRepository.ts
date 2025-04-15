import { OwnerDto } from "@/dto/owner";
import { ResultSetHeader } from "mysql2/promise";

export interface IOwnerRepository {
  AddOwner(username: string, password: string): Promise<OwnerDto>
  ConfirmOwnerLogin(guid: string, username: string, password: string): Promise<boolean>
  DeleteOwnerFromManagementGuid(guid: string): Promise<OwnerDto>
  IsOwnerGuid(guid: string): Promise<boolean>
  GetOwnerList(): Promise<OwnerDto[]>
  GetOwnerIdFromManagementGuid(guid: string): Promise<number | null>
  UpdateOwner(username: string, password: string, guid: string): Promise<ResultSetHeader>
}