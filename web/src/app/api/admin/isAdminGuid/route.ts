import { CreateConnection } from "@/config/mariadbConfig";
import { AdminSchema } from "@/dto/admin/AdminDto";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid || typeof guid !== "string") {
      return new Response("Bad Request: Missing or invalid GUID", {
        status: 400,
      });
    }

    const validation = AdminSchema.safeParse({ guid });

    if (!validation.success) {
      return new Response(
        `Bad Request: ${validation.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const adminRepo = new AdminRepository(db);

    const isValid = await adminRepo.isGuidValid(guid);

    if (!isValid) {
      return new Response("Invalid Link", {
        status: 404,
      });
    }

    return new Response("Good, GUID exists", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error:", {
      status: 500,
    });
  }
}
