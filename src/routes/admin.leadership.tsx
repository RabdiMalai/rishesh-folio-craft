import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/leadership")({ component: LeadershipPage });

const FIELDS: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "organization", label: "Organization", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "date_range", label: "Date range", type: "text" },
  { key: "logo_url", label: "Logo", type: "image", bucket: "logos" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "responsibilities", label: "Responsibilities", type: "list", help: "One per line" },
  { key: "impact", label: "Impact", type: "textarea" },
  { key: "recognition", label: "Recognition", type: "textarea" },
  { key: "metrics", label: "Metrics", type: "metrics", help: "One per line as: Label = Value" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function LeadershipPage() {
  return (
    <CrudManager
      table="leadership_experiences"
      title="Leadership"
      description="Leadership and community involvement entries."
      fields={FIELDS}
      primaryKeys={["title", "organization"]}
    />
  );
}
