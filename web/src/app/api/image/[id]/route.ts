import { RecordRepository } from "@/repositories/mariaDb";
import { CreateConnection } from "@/config/mariadbConfig";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const id = await params.id;
    const db = await CreateConnection();
    const recordRepository = new RecordRepository(db);
    const recordId = Number(id);
    
    if (isNaN(recordId) || recordId <= 0) {
      return new Response("Invalid record ID", {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const receipt = await recordRepository.getReceiptById(recordId);

    if (!receipt) {
      return new Response("Record not found", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(receipt, {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
