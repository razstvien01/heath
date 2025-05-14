import { getAdminReq, isAdminGuidReq } from "@/services/adminService";
import { notFound } from "next/navigation";
import { OwnerManagement } from "@/components/pages/owners/ownerManagement";

export default async function OwnerManagementPage({
  params,
}: {
  params: { guid: string };
}) {
  const { guid } = await params;
  const isAdminGuidRes = await isAdminGuidReq(guid);
  const admin = await getAdminReq(guid);

  if (!isAdminGuidRes || !admin) {
    notFound();
  }

  return (
    <div className="flex-1 container mx-auto py-8 px-4">
      <OwnerManagement guid={guid} admin={admin} />
    </div>
  );
}
