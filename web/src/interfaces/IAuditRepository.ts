import { QueryResult, FieldPacket } from "mysql2";

export interface IAuditRepository {
  addAudit(ownerId: number, name: string): Promise<[QueryResult, FieldPacket[]]>;
  getAuditList(ownerId: number): Promsie<AuditDto>;
  deleteAuditById(auditId: number);
  isAuditPublicGuid(guid: string);
  isAuditPrivateGuid(guid: string): Promise<boolean>;
  updateAudit(name: string, id: number);
  getAuditIdFromGuidd(guid: string): Promise<number | null>;
  getAuditIdFromGuid(guid: string): Promise<number | null>;
}
