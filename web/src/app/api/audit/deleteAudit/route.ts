import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function DELETE(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return new Response("Bad Request: Missing or invalid id", {
        status: 400,
      });
    }

    const validation = AuditSchema.safeParse({
      id,
    });

    if (!validation.success) {
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const auditRepository = new AuditRepository(db);
    await auditRepository.deleteAuditById(Number(id));

    return new Response("Audit deleted successfuzlly", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    
    return new Response(message, {
      status: message === "Audit not found. Deletion aborted." ? 400 : 500,
    });
  }
}
