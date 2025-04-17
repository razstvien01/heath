import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function DELETE(request: Request): Promise<Response> {
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
    const ownerRepo = new OwnerRepository(db);
    const result = await ownerRepo.deleteOwnerFromManagementGuid(
      managementGuid
    );

    if (!result) {
      return new Response("Owner delete failed", {
        status: 500,
      });
    }
    return new Response("Owner deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(`Internal Server Error: ${error}`, {
      status: 500,
    });
  }
}
