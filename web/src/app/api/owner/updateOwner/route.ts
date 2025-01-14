import { CreateConnection  } from "@/config/mariadbConfig";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const guid = formData.get("guid");
    const username = formData.get("username");
    const password = formData.get("password");

    if(username == null || password == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    var DB = CreateConnection();

    const result = DB.execute("UPDATE Owners SET " +
        "name = ?, " +
        "password = PASSWORD(?) " +
        "WHERE managementGuid = ?",
        [username, password, guid],
    );

    if(result) {
        return new Response("Owner updated successfully", {
            status: 200
        });
    } else {
        return new Response("Owner update failed", {
            status: 500
        })
    }
}