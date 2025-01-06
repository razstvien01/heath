import { CreateConnection  } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request)
{
    const formData = await request.formData();

    const guid = formData.get("guid");
    const name = formData.get("name");

    if(name == null || guid == null)
    {
        return new Response("Bad", {
            status: 400
        })
    }

    var DB = CreateConnection();

    const ownerId: any = await new Promise((resolve, reject) => {

        DB.query("SELECT id FROM Owners WHERE managementGuid = ?", [guid], 
        function(err, results) {
            if(err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });

    console.log("Owner Id retrieved ", ownerId);

    if(!Array.isArray(ownerId) || ownerId.length <= 0) {
        return new Response("Invalid Request", {
            status: 500
        })
    } 

    const result = DB.execute("INSERT INTO Audits (ownerId, name, publicGuid, ownerGuid) VALUES " +
        "(?, ?, ?, ?)", 
        [ownerId[0].id, name, uuidv4(), uuidv4()],
    );

    if(result) {
        return new Response("Audit inserted successfully", {
            status: 200
        });
    } else {
        return new Response("Audit insert failed", {
            status: 500
        })
    }
}