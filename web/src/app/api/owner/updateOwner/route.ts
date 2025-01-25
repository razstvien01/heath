import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

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

    const repository = new OwnerRepository();
    const result = await repository.UpdateOwner(username as string, password as string, guid as string)

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