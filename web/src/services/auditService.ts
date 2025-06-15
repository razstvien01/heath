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

export async function addAuditReq(formData: FormData) {
  const addAuditUrl = AuditRoutes.ADD_AUDIT;

  try {
    const res = await axios.post(addAuditUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch {
    return null;
  }
}

export async function updateAuditReq(formData: FormData): Promise<boolean> {
  const updateAuditUrl = AuditRoutes.UPDATE_AUDIT;

  try {
    const res = await axios.put(updateAuditUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.status === 200;
  } catch {
    return false;
  }
}

export async function deleteAuditReq(formData: FormData): Promise<boolean> {
  const deleteAuditUrl = AuditRoutes.DELETE_AUDIT;

  try {
    const res = await axios.delete(deleteAuditUrl, { data: formData });

    return res.status === 200;
  } catch {
    return false;
  }
}
