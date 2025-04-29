import { AdminDto, ConfirmAdminReqDto } from "@/dto/admin";
import Admin from "@/models/Admin";

export default class AdminMapper {
  static toAdminDto(data: Admin): AdminDto {
    return {
      id: data.id,
      name: data.name,
      ownerManagementGuid: data.ownerManagementGuid,
    };
  }

  static toConfirmAdminDto(data: AdminDto): ConfirmAdminReqDto {
    return {
      name: data.name ?? "",
      ownerManagementGuid: data.ownerManagementGuid ?? "",
      password: data.password ?? "",
    };
  }
}
