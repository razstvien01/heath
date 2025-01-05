import OwnerCrud from "@/components/pages/ownerCrud";
import { notFound } from "next/navigation";

async function isAdminGuid(guid : string) {
  const isAdminGuidUrl = process.env.NEXT_PUBLIC_API_URL + "/api/isAdminGuid";

  const formData = new FormData();
  formData.append("guid", guid);

  const res = await fetch(isAdminGuidUrl, {
    method: "POST",
    body: formData
  });

  if(res.ok) {
    return true;
  } 
  return false;
}

export default async function OwnerManagementPage({ params } : { params: { guid : string } }) {
  const { guid } = await params;

  const isAdminGuidRes = await isAdminGuid(guid);
    if(!isAdminGuidRes) {
        notFound();
    }

  return (
    <div>
       <OwnerCrud guid={guid} />
    </div>
  )
};
