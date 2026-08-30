import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/social")({ component: SocialPage });

const FIELDS: Field[] = [
  { key: "platform", label: "Platform", type: "text", help: "e.g. github, linkedin, email" },
  { key: "label", label: "Label", type: "text" },
  { key: "url", label: "URL", type: "text", full: true },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function SocialPage() {
  return (
    <CrudManager
      table="social_links"
      title="Social Links"
      fields={FIELDS}
      primaryKeys={["platform", "label"]}
      searchKeys={["platform", "label", "url"]}
    />
  );
}
