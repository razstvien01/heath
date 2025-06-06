import {
  CreateBackdatedReqDto,
  CreateRecordReqDto,
  RecordDto,
  RecordFilterDto,
  UpdateRecordReqDto,
} from "@/dto/record";
import { IRecordRepository } from "@/interfaces";
import RecordMapper from "@/mappers/RecordMapper";
import Record from "@/models/Record";
import {
  Connection,
  QueryResult,
  FieldPacket,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";

export class RecordRepository implements IRecordRepository {
  private readonly _db: Connection;

  constructor(db: Connection) {
    this._db = db;
  }
  async getReceiptById(id: number): Promise<Buffer | null> {
    if (!(await this.isRecordExists(id))) {
      throw new Error(
        `Record with id ${id} not found. Receipt retrieval aborted.`
      );
    }
    const query = "SELECT receipt FROM Records WHERE id = ?";
    const values = [id];

    const [rows] = await this._db.query<RowDataPacket[]>(query, values);
    return rows.length > 0 ? (rows[0].receipt as Buffer) : null;
  }

  async addBackdated(
    dto: CreateBackdatedReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    const query =
      "INSERT INTO Records (auditId, amount, reason, receipt, signature, approved, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      dto.auditId,
      dto.amount,
      dto.reason,
      dto.receipt,
      dto.signature,
      dto.approved,
      dto.createdAt,
      dto.createdAt,
    ];

    const result = await this._db.execute(query, values);

    return result;
  }
  async isRecordExists(id: number): Promise<boolean> {
    const query = "SELECT 1 FROM Records WHERE id = ?";
    const values = [id];
    const [rows] = await this._db.query<RowDataPacket[]>(query, values);
    return rows.length > 0;
  }

  async addRecord(
    dto: CreateRecordReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    const query =
      "INSERT INTO Records (auditId, amount, reason, receipt, signature, approved) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      dto.auditId,
      dto.amount,
      dto.reason,
      dto.receipt,
      dto.signature,
      dto.approved,
    ];

    const result = await this._db.execute(query, values);

    return result;
  }
  async getRecordList(
    auditId: number,
    filters: RecordFilterDto
  ): Promise<RecordDto[]> {
    let query = "SELECT * FROM Records";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (filters.reason) {
      conditions.push("reason LIKE ?");
      values.push(`%${filters.reason}%`);
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

    if (auditId) {
      conditions.push("auditId = ?");
      values.push(auditId);
    }

    if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

    if (filters.orderBy) {
      const dir =
        filters.orderDirection?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      query += ` ORDER BY ${filters.orderBy} ${dir}`;
    }

    const [rows] = await this._db.query<Record[] & RowDataPacket[]>(
      query,
      values
    );

    const records: RecordDto[] = rows.map((row) => {
      return RecordMapper.toOwnerDto(row);
    });

    return records;
  }

  async getRecords(
    auditId: number,
    filters: RecordFilterDto
  ): Promise<RecordDto[]> {
    let query =
      "SELECT amount, reason, signature, approved, createdAt, updatedAt, auditId, id FROM Records";
    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (filters.reason) {
      conditions.push("reason LIKE ?");
      values.push(`%${filters.reason}%`);
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

    if (auditId) {
      conditions.push("auditId = ?");
      values.push(auditId);
    }

    if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

    if (filters.orderBy) {
      const dir =
        filters.orderDirection?.toUpperCase() === "DESC" ? "DESC" : "ASC";
      query += ` ORDER BY ${filters.orderBy} ${dir}`;
    }

    const [rows] = await this._db.query<Record[] & RowDataPacket[]>(
      query,
      values
    );

    const records: RecordDto[] = rows.map((row) => {
      return {
        amount: row.amount ?? 0,
        reason: row.reason ?? "",
        signature: row.signature ?? "",
        approved: row.approved ?? 0,
        createdAt: row.createdAt ?? new Date(),
        updatedAt: row.updatedAt ?? new Date(),
        auditId: row.auditId ?? 0,
        id: row.id ?? 0,
        imageURL: "api/image/" + row.id,
      };
    });

    return records;
  }

  async updateRecord(
    dto: UpdateRecordReqDto
  ): Promise<[QueryResult, FieldPacket[]]> {
    const query =
      "UPDATE Records SET " +
      "receipt = ?, " +
      "signature = ? " +
      "WHERE id = ?";
    const values = [dto.receipt, dto.signature, dto.id];
    const result = await this._db.execute(query, values);
    const queryResult = result[0] as ResultSetHeader;

    if (queryResult.affectedRows === 0)
      throw new Error(`Record with id ${dto.id} not found`);

    return result;
  }
  async deleteRecordById(id: number): Promise<[QueryResult, FieldPacket[]]> {
    if (!(await this.isRecordExists(id)))
      throw new Error(`Record with id ${id} not found. Deletion aborted.`);

    const query = "DELETE FROM Records WHERE id = ?";
    const values = [id];
    const result = await this._db.execute(query, values);
    return result;
  }
}
