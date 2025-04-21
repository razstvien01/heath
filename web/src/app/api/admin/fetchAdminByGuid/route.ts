import { CreateConnection } from "@/config/mariadbConfig";
import { AdminRepository } from "@/repositories/mariaDb/AdminRepository";
import { AdminSchema } from "@/dto/admin/AdminDto";

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

    const admin = await adminRepo.getAdminByOMGUID(guid);

    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const adminValidation = AdminSchema.safeParse(admin);

    if (!adminValidation.success) {
      console.error(
        "Invalid admin data from DB: ",
        adminValidation.error.format()
      );

      return new Response(JSON.stringify({ message: "Corrupted admin data" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(admin), {
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
      status: message === "Owner with this name already exists." ? 400 : 500,
    });
  }
}
