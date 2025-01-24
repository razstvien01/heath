import { CreateConnection  } from "@/config/mariadbConfig";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

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

    const repository = new OwnerRepository();

    const result = await repository.DeleteOwnerFromManagementGuid(guid as string);

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