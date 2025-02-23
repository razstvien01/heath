import { RecordRepository } from "@/repositories/mariaDb/RecordRepository";

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

    const repository = new RecordRepository();

    const result = await repository.DeleteRecordById(Number(id));

    if(result) {
        return new Response("Record deleted successfully", {
            status: 200
        });
    } else {
        return new Response("Record delete failed", {
            status: 500
        })
    }
}