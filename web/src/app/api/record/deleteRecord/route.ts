import { CreateConnection } from "@/config/mariadbConfig";
import { RecordSchema } from "@/dto/record/RecordDto";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

export async function DELETE(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return new Response("Bad", {
        status: 400,
      });
    }

    const validation = RecordSchema.safeParse({
      id,
    });

    if (!validation.success)
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );

    const db = await CreateConnection();
    const recordRepository = new RecordRepository(db);
    await recordRepository.deleteRecordById(Number(id));

    return new Response("Record deleted successfully", {
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
