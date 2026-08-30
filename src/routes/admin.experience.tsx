import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/experience")({ component: ExperiencePage });

const FIELDS: Field[] = [
  { key: "role", label: "Role", type: "text" },
  { key: "company", label: "Company", type: "text" },
  { key: "employment_type", label: "Employment type", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "start_date", label: "Start date", type: "text" },
  { key: "end_date", label: "End date", type: "text" },
  { key: "is_current", label: "Currently here", type: "boolean" },
  { key: "company_website", label: "Company website", type: "text" },
  { key: "company_logo_url", label: "Company logo", type: "image", bucket: "logos" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "responsibilities", label: "Responsibilities", type: "list", help: "One per line" },
  { key: "technologies", label: "Technologies", type: "list", help: "One per line" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function ExperiencePage() {
  return (
    <CrudManager
      table="experiences"
      title="Experience"
      description="Professional roles. The public section hides itself when empty."
      fields={FIELDS}
      primaryKeys={["role", "company"]}
    />
  );
}
