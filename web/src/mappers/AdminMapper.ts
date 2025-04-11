import AdminDto from "@/dto/admin/AdminDto";
import Admin from "@/models/Admin";

export default class AdminMapper {
  static toAdminDto(data: Admin): AdminDto {
    return {
      id: data.id,
      name: data.name,
      ownerManagementGuid: data.ownerManagementGuid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  }
}