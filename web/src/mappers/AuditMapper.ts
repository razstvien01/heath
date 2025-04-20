import { AuditDto } from "@/dto/audit/AuditDto";
import Audit from "@/models/Audit";

export default class AuditMapper {
  public static toAuditDto(data: Audit): AuditDto {
    return {
      id: data.id,
      name: data.name,
      ownerId: data.ownerGuid,
      publicGuid: data.publicGuid,
    };
  }
}
