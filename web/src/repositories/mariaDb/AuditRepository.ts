import { CreateConnection } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

export class AuditRepository {
  AddAudit(ownerId: number, name: string) {
    const DB = CreateConnection();
    const result = DB.execute(
      "INSERT INTO Audits (ownerId, name, publicGuid, ownerGuid) VALUES " +
        "(?, ?, ?, ?)",
      [ownerId, name, uuidv4(), uuidv4()]
    );

    return result;
  }

  async GetAuditList(ownerId: number) {
    const result = await new Promise((resolve, reject) => {
      const DB = CreateConnection();

      DB.query(
        "SELECT *, 0 as entries FROM Audits WHERE ownerId = ?",
        [ownerId],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    return result;
  }

  DeleteAuditById(auditId: number) {
    const DB = CreateConnection();
    const result = DB.execute("DELETE FROM Audits WHERE id = ?", [auditId]);

    return result;
  }

  async IsAuditPublicGuid(guid: string) {
    const isPublicResult: unknown = await new Promise((resolve, reject) => {
      const DB = CreateConnection();

      DB.query(
        "SELECT * FROM Audits WHERE publicGuid = ?",
        [guid],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (Array.isArray(isPublicResult) && isPublicResult.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async IsAuditPrivateGuid(guid: string) {
    const isPrivateResult: unknown = await new Promise((resolve, reject) => {
      const DB = CreateConnection();

      DB.query(
        "SELECT * FROM Audits WHERE ownerGuid = ?",
        [guid],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (Array.isArray(isPrivateResult) && isPrivateResult.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  UpdateAudit(name: string, id: number) {
    const DB = CreateConnection();

    const result = DB.execute(
      "UPDATE Audits SET " + "name = ? " + "WHERE id = ?",
      [name, id]
    );

    return result;
  }

  async GetAuditIdFromGuid(guid: string): Promise<number | null> {
    const DB = CreateConnection();
    const auditId: unknown = await new Promise((resolve, reject) => {
      DB.query(
        "SELECT id FROM Audits WHERE publicGuid = ? or ownerGuid = ?",
        [guid, guid],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (Array.isArray(auditId) && auditId.length > 0) {
      return auditId[0].id;
    } else {
      return null;
    }
  }
}
