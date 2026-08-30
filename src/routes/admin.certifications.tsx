import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/certifications")({ component: CertificationsPage });

const FIELDS: Field[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "issue_date", label: "Issue date", type: "text" },
  { key: "credential_id", label: "Credential ID", type: "text" },
  { key: "credential_url", label: "Credential URL", type: "text" },
  { key: "file_url", label: "Certificate file", type: "file", bucket: "certificates", full: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function CertificationsPage() {
  return (
    <CrudManager table="certifications" title="Certifications" fields={FIELDS} primaryKeys={["name", "issuer"]} />
  );
}
