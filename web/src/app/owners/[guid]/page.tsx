import OwnerCrud from "@/components/pages/owners/ownerCrud";
import { isAdminGuidReq } from "@/services/adminService";
import { notFound } from "next/navigation";

export default async function OwnerManagementPage({
  params,
}: {
  params: { guid: string };
}) {
  const { guid } = await params;

  const isAdminGuidRes = await isAdminGuidReq(guid);
  if (!isAdminGuidRes) {
    notFound();
  }
  
  return (
    <div>
      <OwnerCrud guid={guid} />
    </div>
  );
}
