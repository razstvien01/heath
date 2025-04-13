import { AdminDto } from "@/dto/admin";

export interface IAdminRepository {
  getAdminByOMGUID(ownerManagementGuid: string): Promise<AdminDto>;
  isAdminValid(
    guid: string | undefined,
    username: string | undefined,
    password: string | undefined
  ): Promise<boolean>;
  isGuidValid(ownerManagementGuid: string): Promise<boolean>;
}
