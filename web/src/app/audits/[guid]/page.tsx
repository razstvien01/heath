import { AuditManagement } from "@/components/pages/audits/auditManagement";
import { isOwnerGuid } from "@/services/ownerService";
import { notFound } from "next/navigation";

export default async function AuditManagementPage({
  params,
}: {
  params: { guid: string };
}) {
  const { guid } = await params;
  const isAdminGuidRes = await isOwnerGuid(guid);

  if (!isAdminGuidRes) {
    notFound();
  }

  return (
    <div className="flex-1 container mx-auto py-8 px-4">
      <AuditManagement guid={guid}/>
    </div>
  );
}
