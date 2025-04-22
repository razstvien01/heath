import { CreateAuditReqDto, UpdateAuditReqDto } from "@/dto/audit";
import { AuditDto } from "@/dto/audit/AuditDto";
import { QueryResult, FieldPacket } from "mysql2";

export interface IAuditRepository {
  addAudit(dto: CreateAuditReqDto): Promise<[QueryResult, FieldPacket[]]>;
  getAuditList(ownerId: number): Promise<AuditDto>;
  deleteAuditById(
    auditId: number
  ): Promise<[QueryResult, FieldPacket[]] | null>;
  isAuditPublicGuid(guid: string): Promise<boolean>;
  isAuditPrivateGuid(guid: string): Promise<boolean>;
  updateAudit(dto: UpdateAuditReqDto): Promise<[QueryResult, FieldPacket[]]>;
  getAuditIdFromGuid(guid: string): Promise<number | null>;
}
