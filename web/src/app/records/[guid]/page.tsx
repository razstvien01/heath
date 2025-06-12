import PrivateRecordCrud from "@/components/pages/privateRecordCrud";
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
    <div>
      {!isPublicGuidRes.isPublic && <PrivateRecordCrud guid={guid} />}
      {isPublicGuidRes.isPublic && <RecordManagement guid={guid} />}
    </div>
  );
}
