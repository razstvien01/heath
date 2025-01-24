import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request)
{
    const formData = await request.formData();
    const guid = formData.get("guid");
    const username = formData.get("username");
    const password = formData.get("password");

    if(guid == null || username == null || password == null)
    {
        return new Response("Bad Request", {
            status: 400
        })
    }

    const ownerRepository = new OwnerRepository()
    const result = await ownerRepository.ConfirmOwnerLogin(guid as string, username as string, password as string)

    if(result) {
        return new Response("Valid Owner", {
            status: 200
        });
    } 

    return new Response("Bad Request", {
        status: 400
    })
}