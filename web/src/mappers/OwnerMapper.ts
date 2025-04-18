import { CreateOwnerReqDto, OwnerDto, UpdateOwnerReqDto } from "@/dto/owner";
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

  public static toOwnerFromCreateDto(data: Owner): CreateOwnerReqDto {
    return {
      name: data.name || "",
      password: data.password || ""
    };
  }

  public static toOwnerFromUpdateDto(data: UpdateOwnerReqDto): Owner {
    return {
      name: data.name,
      managementGuid: data.managementGuid,
    };
  }
}
