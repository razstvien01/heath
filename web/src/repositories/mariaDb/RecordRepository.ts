import {
  CreateRecordReqDto,
  RecordDto,
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
  async getRecordList(auditId: number): Promise<RecordDto[]> {
    const query = "SELECT * FROM Records WHERE auditId = ?";

    const [rows] = await this._db.query<Record[] & RowDataPacket[]>(query, [
      auditId,
    ]);

    const records: RecordDto[] = rows.map((row) => {
      return RecordMapper.toOwnerDto(row);
    });

    return records;
  }
  updateRecord(dto: UpdateRecordReqDto): Promise<[QueryResult, FieldPacket[]]> {
    throw new Error("Method not implemented.");
  }
  deleteRecordById(id: number): Promise<[QueryResult, FieldPacket[]]> {
    throw new Error("Method not implemented.");
  }
  // async GetRecordList(auditId: number) {
  //   const DB = CreateConnection();
  //   const [results]: unknown[] = await (await DB).query(
  //     "SELECT *, UNIX_TIMESTAMP(dateCreated) as dateCreatedEpoch FROM Records WHERE auditId = ?",
  //     [auditId]
  //   );

  //   return results;
  // }

  // async UpdateRecord(id: number, receipt: ArrayBuffer, signature: string) {
  //   const DB = CreateConnection();
  //   const result = (await DB).execute(
  //     "UPDATE Records SET " +
  //       "receipt = ?, " +
  //       "signature = ? " +
  //       "WHERE id = ?",
  //     [receipt, signature, id]
  //   );

  //   return result;
  // }

  // async DeleteRecordById(id: number) {
  //   const DB = CreateConnection();
  //   const result = (await DB).execute("DELETE FROM Records WHERE id = ?", [id]);
  //   return result;
  // }
}
