import PrivateRecordCrud from "@/components/pages/privateRecordCrud";
import RecordCrud from "@/components/pages/records/recordCrud";
import { notFound } from "next/navigation";

interface PageInfo {
  isPublic: boolean;
  isInvalid: boolean;
}

async function isPublicGuid(guid : string) {
  const isPublicGuidUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/isPublicGuid";

  const formData = new FormData();
  formData.append("guid", guid);

  let isInvalid = false;

  const val : boolean = await new Promise((resolve, reject) => {
    fetch(isPublicGuidUrl, {
      method: "POST",
      body: formData
    })
    .then(res => {
      isInvalid = !res.ok
      return res.json()
    })
    .then(data => {
      resolve(data)
    }).catch(err => {
      reject(err)
    })
  });

  var output : PageInfo = {
    isInvalid: isInvalid,
    isPublic: val,
  }

  return output;
}

export default async function AuditManagementPage({ params } : { params: { guid : string } }) {
  const { guid } = await params;

  const isPublicGuidRes = await isPublicGuid(guid);
  
  console.log(isPublicGuidRes)

  if(isPublicGuidRes.isInvalid) {
      notFound();
  }

  return (
    <div>
      {!isPublicGuidRes.isPublic && (
        <PrivateRecordCrud guid={guid} />
      )}
      {isPublicGuidRes.isPublic && (
        <RecordCrud guid={guid} />
      )}
    </div>
  )
};
