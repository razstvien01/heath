import { AuditRoutes } from "@/constants";
import { AuditFilterDto } from "@/dto/audit/AuditFilterDto";
import axios from "axios";

export async function fetchAuditsReq(
  formData: FormData,
  filter: AuditFilterDto
) {
  const getAuditsUrl = AuditRoutes.AUDIT_LIST;
  const queryParams = new URLSearchParams();

  (Object.keys(filter) as (keyof AuditFilterDto)[]).forEach((key) => {
    const value = filter[key];
    if (value !== undefined && value !== null && value !== "")
      queryParams.append(key, String(value));
  });

  try {
    const res = await axios.post(
      `${getAuditsUrl}?${queryParams.toString()}`,
      formData
    );

    return res;
  } catch {
    return null;
  }
}
