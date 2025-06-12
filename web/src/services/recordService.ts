import { AuditRoutes } from "@/constants";
import axios from "axios";

interface PageInfo {
  isPublic: boolean;
  isInvalid: boolean;
}

export async function isPublicGuid(guid: string) {
  const isPublicGuidUrl = AuditRoutes.IS_PUBLIC_GUID

  const formData = new FormData();
  formData.append("guid", guid);

  let isInvalid = false;

  const val: boolean = await new Promise((resolve, reject) => {
    axios
      .post(isPublicGuidUrl, formData)
      .then((res) => {
        isInvalid = res.status !== 200;
        return res.data;
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  const output: PageInfo = {
    isInvalid: isInvalid,
    isPublic: val,
  };

  return output;
}
