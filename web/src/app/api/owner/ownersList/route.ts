import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request)
{
    try {
        const ownerRepository = new OwnerRepository()
        const result = await ownerRepository.GetOwnerList()

        return new Response(JSON.stringify(result), {
            status: 200,
        });
    } catch (e) {
        return new Response(null, {
            status: 400,
        });
    }
}