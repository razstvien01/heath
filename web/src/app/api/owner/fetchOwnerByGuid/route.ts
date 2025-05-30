import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid)
      return new Response("Bad Request: Missing GUID", {
        status: 400,
      });

    const validation = OwnerSchema.safeParse({ managementGuid: guid });

    if (!validation.success)
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );

    const db = await CreateConnection();
    const ownerRepo = new OwnerRepository(db);
    const owner = await ownerRepo.getOwnerByMGuid(guid as string);

    if (!owner) {
      return new Response(JSON.stringify({ message: "Owner not found" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(owner), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: message.includes("not found") ? 400 : 500,
    });
  }
}
