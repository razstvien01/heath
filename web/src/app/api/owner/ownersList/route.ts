import { CreateConnection } from "@/config/mariadbConfig";
import { OwnerFilterSchema } from "@/dto/owner/OwnerFIlterDto";
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
      orderBy: searchParams.get("orderBy") ?? undefined,
      orderDirection: searchParams.get("orderDirection") ?? undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : undefined,
      pageSize: searchParams.get("pageSize")
        ? parseInt(searchParams.get("pageSize")!)
        : undefined,
    };

    const parsed = OwnerFilterSchema.safeParse(body);

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
    const owners = await ownerRepository.getOwnerList(parsed.data);
    const total = await ownerRepository.getOwnerTotalCount(parsed.data);

    if (!owners || owners.length === 0) {
      return new Response(JSON.stringify({ message: "No Owners found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ owners, total }), {
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
      status: 500,
    });
  }
}
