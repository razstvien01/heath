const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if(!BASE_URL){
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
}

const AUDIT_URL = BASE_URL + "/api/audit";

export const AuditRoutes = Object.freeze({
  AUDIT_LIST: `${AUDIT_URL}/auditList`,
  ADD_AUDIT: `${AUDIT_URL}/addAudit`,
  UPDATE_AUDIT: `${AUDIT_URL}/updateAudit`
})