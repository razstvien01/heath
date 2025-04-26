import { CreateConnection } from "@/config/mariadbConfig";
import { AuditDto, CreateAuditReqDto, UpdateAuditReqDto } from "@/dto/audit";
import { AuditFilterDto } from "@/dto/audit/AuditFilterDto";
import { IAuditRepository } from "@/interfaces";
import AuditMapper from "@/mappers/AuditMapper";
import Audit from "@/models/Audit";
import {
  Connection,
  FieldPacket,
  QueryResult,
  RowDataPacket,
} from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export class AuditRepository implements IAuditRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }

  async addAudit(
    dto: CreateAuditReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    const query =
      "INSERT INTO Audits (ownerId, name, publicGuid, ownerGuid) VALUES " +
      "(?, ?, ?, ?)";
    const values = [dto.ownerId, dto.name, uuidv4(), uuidv4()];

    try {
      const result = await this._db.execute(query, values);

      return result;
    } catch (error) {
      console.log("Error inserting a new audit:", error);
      throw new Error("Failed to add a new audit.");
    }
  }

  async getAuditList(
    ownerId: number,
    filters: AuditFilterDto
  ): Promise<AuditDto[]> {
    let query = "SELECT *, 0 AS ENTRIES FROM Audits";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    //* Applying filters
    if (filters.name) {
      conditions.push("name LIKE ?");
      values.push(`%${filters.name}%`);
    }

    if (filters.createdFrom) {
      conditions.push("createdAt >= ?");
      values.push(filters.createdFrom);
    }

    if (filters.createdTo) {
      conditions.push("createdAt <= ?");
      values.push(filters.createdTo);
    }

    if (filters.updatedFrom) {
      conditions.push("updatedAt >= ?");
      values.push(filters.updatedFrom);
    }

    if (filters.updatedTo) {
      conditions.push("updatedAt <= ?");
      values.push(filters.updatedTo);
    }

    if (ownerId) {
      conditions.push("ownerId = ?");
      values.push(ownerId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (filters.orderBy) {
      const dir =
        filters.orderDirection?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      query += ` ORDER BY ${filters.orderBy} ${dir}`;
    }

    //* Pagination
    const offset = (filters.page - 1) * filters.pageSize;

    query += " LIMIT ? OFFSET ?";
    values.push(filters.pageSize, offset);

    try {
      const [rows] = await this._db.query<Audit[] & RowDataPacket[]>(
        query,
        values
      );

      const audits: AuditDto[] = rows.map((row: Audit) => {
        return AuditMapper.toAuditDto(row);
      });

      return audits;
    } catch (error) {
      console.error("Error fetching audits:", error);
      throw new Error("Failed to fetch owners");
    }
  }

  async deleteAuditById(
    auditId: number
  ): Promise<[QueryResult, FieldPacket[]]> {
    try {
      const [rows] = await this._db.query<RowDataPacket[]>(
        "SELECT 1 FROM Audits WHERE id = ?",
        [auditId]
      );

      if (rows.length === 0) {
        console.log("Audit not found");
        throw new Error("Audit not found. Deletion aborted.");
      }

      const result = await this._db.execute("DELETE FROM Audits WHERE id = ?", [
        auditId,
      ]);

      return result;
    } catch (error) {
      console.log("Error deleting audit by auditId:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete an audit");
    }
  }

  async isAuditPublicGuid(guid: string): Promise<boolean> {
    const query = "SELECT 1 FROM Audits WHERE publicGuid = ?";
    const values = [guid];
    try {
      const [rows] = await this._db.query<[RowDataPacket[]]>(query, values);

      console.log(rows.values);
      console.log(rows.length);

      return rows.length > 0;
    } catch (error) {
      console.error("Error validating Audit Public guid:", error);
      throw new Error("Failed to validate the Audit Public guid.");
    }
  }

  async isAuditPrivateGuid(guid: string): Promise<boolean> {
    const query = "SELECT 1 FROM Audits WHERE ownerGuid = ?";
    const values = [guid];
    try {
      const [rows] = await this._db.query<RowDataPacket[]>(query, values);

      return rows.length > 0;
    } catch (error) {
      console.error("Error validating Audit Private guid:", error);
      throw new Error("Failed to validate to the Audit Private guid.");
    }
  }

  async updateAudit(
    dto: UpdateAuditReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    const DB = await CreateConnection();

    const result = await DB.execute(
      "UPDATE Audits SET " + "name = ? " + "WHERE id = ?",
      [dto.name, dto.id]
    );

    return result;
  }

  async getAuditIdFromGuid(guid: string): Promise<number | null> {
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
