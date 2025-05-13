import { getAdminReq, isAdminGuidReq } from "@/services/adminService";
import { notFound } from "next/navigation";
import { Wallet } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            <span className="text-2xl font-bold">Heath</span>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto py-8 px-4">
        <OwnerManagement guid={guid} admin={admin} />
      </div>
    </div>
  );
}
