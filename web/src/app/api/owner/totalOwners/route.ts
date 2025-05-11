import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerCountFilterSchema } from "@/dto/owner/OwnerCountFilterDto";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    const body = {
      name: searchParams.get("name") ?? undefined,
      createdFrom: searchParams.get("createdFrom") ?? undefined,
      createdTo: searchParams.get("createdTo") ?? undefined,
      updatedFrom: searchParams.get("updatedFrom") ?? undefined,
      updatedTo: searchParams.get("updatedTo") ?? undefined,
    };

    const parsed = OwnerCountFilterSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid filter",
          issues: parsed.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = await CreateConnection();
    const ownerRepository = new OwnerRepository(db);
    const counts = await ownerRepository.getOwnerTotalCount(parsed.data);

    return new Response(JSON.stringify({ total: counts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching total owners:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    return new Response(message, {
      status: 500,
    });
  }
}
