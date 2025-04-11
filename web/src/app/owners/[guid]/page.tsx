import OwnerCrud from "@/components/pages/owners/ownerCrud";
import axios from "axios";
import { notFound } from "next/navigation";

async function isAdminGuid(guid: string) {
  const isAdminGuidUrl =
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/isAdminGuid";

  const formData = new FormData();
  formData.append("guid", guid);

  const res = await axios.post(isAdminGuidUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (res.status === 200) {
    return true;
  }
  return false;
}

export default async function OwnerManagementPage({
  params,
}: {
  params: { guid: string };
}) {
  const { guid } = await params;

  const isAdminGuidRes = await isAdminGuid(guid);
  if (!isAdminGuidRes) {
    notFound();
  }

  return (
    <div>
      <OwnerCrud guid={guid} />
    </div>
  );
}
