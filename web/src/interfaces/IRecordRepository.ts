import {
  CreateBackdatedReqDto,
  CreateRecordReqDto,
  RecordDto,
  RecordFilterDto,
  UpdateRecordReqDto,
} from "@/dto/record";
import { FieldPacket, QueryResult } from "mysql2/promise";

export interface IRecordRepository {
  addRecord(dto: CreateRecordReqDto): Promise<[QueryResult, FieldPacket[]]>;
  addBackdated(dto: CreateBackdatedReqDto): Promise<[QueryResult, FieldPacket[]]>;
  getRecordList(
    auditId: number,
    filters: RecordFilterDto
  ): Promise<RecordDto[]>;
  updateRecord(dto: UpdateRecordReqDto): Promise<[QueryResult, FieldPacket[]]>;
  deleteRecordById(id: number): Promise<[QueryResult, FieldPacket[]]>;
  isRecordExists(id: number): Promise<boolean>;
}
