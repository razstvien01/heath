import {
  CreateRecordReqDto,
  RecordDto,
  UpdateRecordReqDto,
} from "@/dto/record";
import { FieldPacket, QueryResult } from "mysql2/promise";

export interface IRecordRepository {
  addRecord(dto: CreateRecordReqDto): Promise<[QueryResult, FieldPacket[]]>;
  getRecordList(auditId: number): Promise<RecordDto[]>;
  updateRecord(dto: UpdateRecordReqDto): Promise<[QueryResult, FieldPacket[]]>;
  deleteRecordById(id: number): Promise<[QueryResult, FieldPacket[]]>;
}
