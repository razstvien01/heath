import {
  ConfirmOwnerReqDto,
  CreateOwnerReqDto,
  OwnerDto,
  UpdateOwnerReqDto,
} from "@/dto/owner";
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

  public static toOwnerFromCreateDto(data: OwnerDto): CreateOwnerReqDto {
    return {
      name: data.name ?? "",
      password: data.password ?? "",
    };
  }

  public static toOwnerFromUpdateDto(data: OwnerDto): UpdateOwnerReqDto {
    return {
      name: data.name ?? "",
      password: data.password ?? "",
      managementGuid: data.managementGuid ?? "",
    };
  }

  public static toConfirmOwnerDto(data: OwnerDto): ConfirmOwnerReqDto {
    return {
      name: data.name ?? "",
      managementGuid: data.managementGuid ?? "",
      password: data.password ?? "",
    };
  }
}
