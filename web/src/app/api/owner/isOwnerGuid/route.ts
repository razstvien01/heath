import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid || typeof guid !== "string") {
      return new Response("Bad Request: Missing or invalid GUID", {
        status: 400,
      });
    }

    const validation = OwnerSchema.safeParse({
      managementGuid: guid,
    });

    if (!validation.success) {
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const { managementGuid = "" } = validation.data;
    const db = await CreateConnection();

    const ownerRepository = new OwnerRepository(db);
    const isValid = await ownerRepository.isOwnerGuid(managementGuid);

    if (!isValid) {
      return new Response("Invalid Gu id Link", {
        status: 404,
      });
    }

    return new Response("Valid Guid link", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: 500,
    });
  }
}
