import { CreateConnection } from "@/config/mariadbConfig";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const guid = formData.get("guid");

    if (!guid) {
      return new Response("Bad Request: Missing GUID", {
        status: 400,
      });
    }

    const db = await CreateConnection();
    const adminRepo = new AdminRepository(db);

    const result = await adminRepo.getAdminByOMGUID(guid.toString());

    if (Array.isArray(result) && result.length > 0) {
      return new Response("Good, GUID exists", {
        status: 200,
      });
    }

    return new Response("Invalid Link", {
      status: 404,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
