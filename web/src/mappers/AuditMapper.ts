import { CreateAuditReqDto, UpdateAuditReqDto } from "@/dto/audit";
import { AuditDto } from "@/dto/audit/AuditDto";
import Audit from "@/models/Audit";

export default class AuditMapper {
  public static toAuditDto(data: Audit): AuditDto {
    return {
      id: data.id || undefined,
      name: data.name || "",
      ownerId: data.ownerGuid || "",
      publicGuid: data.publicGuid || "",
      createdAt: data.createdAt || new Date(),
    };
  }

  public static toAuditFromCreateDto(data: Audit): CreateAuditReqDto {
    return {
      name: data.name || "",
      ownerId: data.ownerGuid || "",
    };
  }

  public static toAuditFromUpdateDto(data: Audit): UpdateAuditReqDto {
    return {
      name: data.name || "",
      ownerId: data.ownerGuid || "",
    };
  }
}
