import CreateOwnerReqDto from "@/dto/owner/CreateOwnerReqDto";
import OwnerDto from "@/dto/owner/OwnerDto";
import UpdateOwnerReqDto from "@/dto/owner/UpdateOwnerReqDto";
import Owner from "@/models/Owner";

export default class OwnerMapper {
  public static toOwnerDto(data: Owner): OwnerDto {
    return {
      id: data.id,
      name: data.name,
      managementGuid: data.managementGuid,
      createdAt: data.createdAt,
    };
  }

  public static toOwnerFromCreateDto(data: CreateOwnerReqDto): Owner {
    return {
      name: data.name,
      managementGuid: data.managementGuid,
    };
  }

  public static toOwnerFromUpdateDto(data: UpdateOwnerReqDto): Owner {
    return {
      name: data.name,
      managementGuid: data.managementGuid,
    };
  }
}
