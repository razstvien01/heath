import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import AuditMapper from "@/mappers/AuditMapper";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function PUT(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const idFD = formData.get("id");
    const nameFD = formData.get("name");

    if (!nameFD || !idFD) {
      return new Response("The id and name are required.", {
        status: 400,
      });
    }

    const input = {
      id: idFD,
      name: nameFD,
    };

    const validation = AuditSchema.safeParse(input);

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
    const dto = AuditMapper.toAuditFromUpdateDto(validation.data);
    const result = await auditRepository.updateAudit(dto);

    if (!result) {
      return new Response("Audit update failed", {
        status: 500,
      });
    }

    return new Response("Audit updated successfully", {
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
