import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";
import { sign } from "crypto";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const recordId = formData.get("id");
    const receiptFile = formData.get("receipt");
    const signature = formData.get("signature");

    const receipt = await new Promise((resolve, reject) => {
        (receiptFile as File).arrayBuffer().then((arrayBuffer) => {
            resolve(arrayBuffer)
        })
    })

    if(recordId == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    const recordRepository = new RecordRepository();

    const result = await recordRepository.UpdateRecord(Number(recordId), receipt as ArrayBuffer, signature as string)

    if(result) {
        return new Response("Record updated successfully", {
            status: 200
        });
    } else {
        return new Response("Record update failed", {
            status: 500
        })
    }
}