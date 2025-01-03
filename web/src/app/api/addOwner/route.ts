import { CreateConnection  } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const username = formData.get("username");
    const password = formData.get("password");

    if(username == null || password == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    var DB = CreateConnection();
    const result = DB.execute("INSERT INTO Owners (name, password, managementGuid) VALUES " +
        "(?, PASSWORD(?), ?)", 
        [username, password, uuidv4()],
    );

    if(result) {
        return new Response("Owner inserted successfully", {
            status: 200
        });
    } else {
        return new Response("Admin insert failed", {
            status: 500
        })
    }
}