import { AdminDto, ConfirmAdminReqDto } from "@/dto/admin";

export interface IAdminRepository {
  getAdminByOMGUID(ownerManagementGuid: string): Promise<AdminDto>;
  isAdminValid(dto: ConfirmAdminReqDto): Promise<boolean>;
  isGuidValid(ownerManagementGuid: string): Promise<boolean>;
}
