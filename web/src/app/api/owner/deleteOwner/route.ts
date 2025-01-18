import { CreateConnection  } from "@/config/mariadbConfig";

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

    var DB = CreateConnection();
    const result = DB.execute("DELETE FROM Owners WHERE managementGuid = ?",
        [guid],
    );

    if(result) {
        return new Response("Owner deleted successfully", {
            status: 200
        });
    } else {
        return new Response("Owner delete failed", {
            status: 500
        })
    }
}