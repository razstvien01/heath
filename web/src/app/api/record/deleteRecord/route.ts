import { CreateConnection } from "@/config/mariadbConfig";
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

    const db = await CreateConnection();
    const repository = new RecordRepository(db);

    const result = await repository.deleteRecordById(Number(id));

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
