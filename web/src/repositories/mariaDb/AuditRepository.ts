import { CreateConnection } from "@/config/mariadbConfig";
import { Connection } from "mysql2";
import { v4 as uuidv4 } from "uuid";

export class AuditRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }

  async AddAudit(ownerId: number, name: string) {
    const result = await this._db.execute(
      "INSERT INTO Audits (ownerId, name, publicGuid, ownerGuid) VALUES " +
        "(?, ?, ?, ?)",
      [ownerId, name, uuidv4(), uuidv4()]
    );

    return result;
  }

  async GetAuditList(ownerId: number) {
    const result = await new Promise(async (resolve, reject) => {
      const DB = await CreateConnection();

      try {
        const [results] = await (
          await DB
        ).query("SELECT *, 0 as entries FROM Audits WHERE ownerId = ?", [
          ownerId,
        ]);
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
    return result;
  }

  async DeleteAuditById(auditId: number) {
    const DB = await CreateConnection();
    const result = await DB.execute("DELETE FROM Audits WHERE id = ?", [
      auditId,
    ]);

    return result;
  }

  async IsAuditPublicGuid(guid: string) {
    const DB = await CreateConnection();
    const [isPublicResult]: unknown[] = await DB.query(
      "SELECT * FROM Audits WHERE publicGuid = ?",
      [guid]
    );

    if (Array.isArray(isPublicResult) && isPublicResult.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async IsAuditPrivateGuid(guid: string): Promise<boolean> {
    const DB = await CreateConnection();
    const [isPrivateResult]: unknown[] = await DB.query(
      "SELECT * FROM Audits WHERE ownerGuid = ?",
      [guid]
    );

    if (Array.isArray(isPrivateResult) && isPrivateResult.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async UpdateAudit(name: string, id: number) {
    const DB = await CreateConnection();

    const result = await DB.execute(
      "UPDATE Audits SET " + "name = ? " + "WHERE id = ?",
      [name, id]
    );

    return result;
  }

  async GetAuditIdFromGuidd(guid: string): Promise<number | null> {
    const DB = await CreateConnection();
    const [rows]: unknown[] = await DB.query(
      "SELECT id FROM Audits WHERE publicGuid = ? or ownerGuid = ?",
      [guid, guid]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0].id;
    } else {
      return null;
    }
  }

  async GetAuditIdFromGuid(guid: string): Promise<number | null> {
    const DB = await CreateConnection();

    try {
      const [results]: unknown[] = await DB.query(
        "SELECT id FROM Audits WHERE publicGuid = ? or ownerGuid = ?",
        [guid, guid]
      );

      if (Array.isArray(results) && results.length > 0) {
        return results[0].id;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error executing query:", err);
      return null;
    }
  }
}
