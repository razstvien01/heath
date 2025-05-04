import OwnerCrud from "@/components/pages/owners/ownerCrud";
import { getAdminReq, isAdminGuidReq } from "@/services/adminService";
import { notFound } from "next/navigation";

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
    <div>
      <OwnerCrud guid={guid} admin={admin} />
    </div>
  );
}
