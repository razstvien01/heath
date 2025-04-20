import { AuditDto } from "@/dto/audit/AuditDto";
import { QueryResult, FieldPacket } from "mysql2";

export interface IAuditRepository {
  addAudit(
    ownerId: number,
    name: string
  ): Promise<[QueryResult, FieldPacket[]]>;
  getAuditList(ownerId: number): Promise<AuditDto>;
  deleteAuditById(
    auditId: number
  ): Promise<[QueryResult, FieldPacket[]] | null>;
  isAuditPublicGuid(guid: string): Promise<boolean>;
  isAuditPrivateGuid(guid: string): Promise<boolean>;
  updateAudit(name: string, id: number): Promise<[QueryResult, FieldPacket[]]>;
  getAuditIdFromGuid(guid: string): Promise<number | null>;
}
