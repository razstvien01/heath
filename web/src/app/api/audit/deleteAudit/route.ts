import { CreateConnection  } from "@/config/mariadbConfig";

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

    var DB = CreateConnection();
    const result = DB.execute("DELETE FROM Audits WHERE id = ?",
        [id],
    );

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