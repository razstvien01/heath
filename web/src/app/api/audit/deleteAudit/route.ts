import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const id = formData.get("id");

    if(id == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const auditRepository = new AuditRepository();

    const result = auditRepository.DeleteAuditById(Number(id))

    if(result) {
        return new Response("Audit deleted successfully", {
            status: 200
        });
    } else {
        return new Response("Audit delete failed", {
            status: 500
        })
    }
}