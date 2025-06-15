import RecordManagement from "@/components/pages/records/recordManagement";
import { isPublicGuid } from "@/services/recordService";
import { notFound } from "next/navigation";

export default async function AuditManagementPage({
  params,
}: {
  params: { guid: string };
}) {
  const { guid } = await params;

  const isPublicGuidRes = await isPublicGuid(guid);

  if (isPublicGuidRes.isInvalid) {
    notFound();
  }

  return (
    <div className="flex-1 container mx-auto py-8 px-4">
      <RecordManagement
        key="public"
        guid={guid}
        mode={isPublicGuidRes.isPublic ? "public" : "private"}
      />
    </div>
  );
}
