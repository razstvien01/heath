import { CreateConnection } from "@/config/mariadbConfig";
import { AuditSchema } from "@/dto/audit/AuditDto";
import { AuditFilterSchema } from "@/dto/audit/AuditFilterDto";
import { OwnerSchema } from "@/dto/owner/OwnerDto";
import { AuditRepository } from "@/repositories/mariaDb/AuditRepository";
import { OwnerRepository } from "@/repositories/mariaDb/OwnerRepository";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const managementGuid = formData.get("guid");

    if (!managementGuid) {
      return new Response("Management GUID is required.", {
        status: 400,
      });
    }

    const parsedGUID = OwnerSchema.safeParse({ managementGuid });

    if (!parsedGUID.success) {
      return new Response(
        `Bad Request: ${parsedGUID.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

    const db = await CreateConnection();
    const ownerRepository = new OwnerRepository(db);
    const ownerId = await ownerRepository.getOwnerIdFromManagementGuid(
      managementGuid as string
    );

    if (!ownerId) {
      return new Response("Owner ID is required.", {
        status: 400,
      });
    }

    const parsedOwnerId = AuditSchema.safeParse({ ownerId });

    if (!parsedOwnerId.success) {
      return new Response(
        `Bad Request: ${parsedOwnerId.error.issues[0].message}`,
        {
          status: 400,
        }
      );
    }

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

    const parsedFilter = AuditFilterSchema.safeParse(body);

    if (!parsedFilter.success) {
      return new Response(
        JSON.stringify({
          message: "Invalid filter",
          issues: parsedFilter.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const filters = parsedFilter.data;
    const auditRepository = new AuditRepository(db);
    const audits = await auditRepository.getAuditList(ownerId, filters);
    const total = await auditRepository.getAuditTotalCount(ownerId, filters);

    if (!audits || audits.length === 0) {
      return new Response(JSON.stringify({ message: "No Audits found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ audits, total }), {
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
