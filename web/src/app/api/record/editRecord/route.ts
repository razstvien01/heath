import { CreateConnection } from "@/config/mariadbConfig";
import { UpdateRecordSchema } from "@/dto/record/UpdateRecordReqDto";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

export async function PUT(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const recordId = formData.get("id");
    const receiptFile = formData.get("receipt");
    const signature = formData.get("signature");

    const receipt =
      receiptFile instanceof File
        ? Buffer.from(await receiptFile.arrayBuffer())
        : null;

    const parsedRecord = UpdateRecordSchema.safeParse({
      id: Number(recordId),
      receipt,
      signature,
    });

    if (!parsedRecord.success)
      return new Response(
        `Bad Request: ${parsedRecord.error.issues[0].message}`,
        {
          status: 400,
        }
      );

    const db = await CreateConnection();
    const recordRepository = new RecordRepository(db);
    const result = await recordRepository.updateRecord(parsedRecord.data);

    if (!result) throw new Error("Failed to update record");

    return new Response("Record updated successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: message.includes("not found") ? 400 : 500,
    });
  }
}
