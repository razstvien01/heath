import { CreateConnection  } from "@/config/mariadbConfig";

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

    var DB = CreateConnection();

    const result = DB.execute("UPDATE Audits SET " +
        "name = ? " +
        "WHERE id = ?",
        [name, id],
    );

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