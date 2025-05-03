import {
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
    // const query = "SELECT * FROM Records WHERE auditId = ?";
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
  deleteRecordById(id: number): Promise<[QueryResult, FieldPacket[]]> {
    throw new Error("Method not implemented.");
  }

  // async DeleteRecordById(id: number) {
  //   const DB = CreateConnection();
  //   const result = (await DB).execute("DELETE FROM Records WHERE id = ?", [id]);
  //   return result;
  // }
}
