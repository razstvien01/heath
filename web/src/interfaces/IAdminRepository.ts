import AdminDto from "@/dto/admin/AdminDto";

export interface IAdminRepository {
  getAdminByOMGUID(ownerManagementGuid: string): Promise<AdminDto[]>;
}
