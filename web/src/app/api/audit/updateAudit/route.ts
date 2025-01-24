import { CreateConnection  } from "@/config/mariadbConfig";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const id = formData.get("id");
    const name = formData.get("name");

    if(name == null || id == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const auditRepository = new AuditRepository()
    const result = auditRepository.UpdateAudit(name as string, Number(id))

    if(result) {
        return new Response("Audit updated successfully", {
            status: 200
        });
    } else {
        return new Response("Audit update failed", {
            status: 500
        })
    }
}