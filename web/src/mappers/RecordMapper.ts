import { RecordDto } from "@/dto/record";
import Record from "@/models/Record";

export default class RecordMapper {
  public static toRecordDto(data: Record): RecordDto {
    return {
      amount: data.amount ?? 0,
      reason: data.reason ?? "",
      receipt: data.receipt ?? Buffer.from(""),
      signature: data.signature ?? "",
      approved: data.approved ?? 0,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      auditId: data.auditId ?? 0,
      id: data.id ?? 0,
    };
  }

  public static toRecordUrlDto(data: Record) {
    return {
      amount: data.amount ?? 0,
      reason: data.reason ?? "",
      signature: data.signature ?? "",
      approved: data.approved ?? 0,
      createdAt: data.createdAt ?? new Date(),
      updatedAt: data.updatedAt ?? new Date(),
      auditId: data.auditId ?? 0,
      id: data.id ?? 0,
      receiptUrl: "api/image/" + data.id,
    };
  }
}
