import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/achievements")({ component: AchievementsPage });

const FIELDS: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "context", label: "Context", type: "text" },
  { key: "metric", label: "Metric", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function AchievementsPage() {
  return <CrudManager table="achievements" title="Achievements" fields={FIELDS} primaryKeys={["title"]} />;
}
