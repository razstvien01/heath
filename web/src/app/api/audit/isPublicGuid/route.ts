import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();
    const guid = formData.get("guid");
    if(guid == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const auditRepository = new AuditRepository()
    const isPublicResult = await auditRepository.IsAuditPublicGuid(guid as string);

    if(isPublicResult) {
        return new Response(JSON.stringify(true), {
            status: 200,
        });
    } 

    const isPrivateResult = await auditRepository.IsAuditPrivateGuid(guid as string);

    if(isPrivateResult) {
        return new Response(JSON.stringify(false), {
            status: 200,
        });
    }

    return new Response(JSON.stringify(false), {
        status: 500
    })
}