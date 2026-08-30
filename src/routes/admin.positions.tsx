import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/positions")({ component: PositionsPage });

const FIELDS: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "organization", label: "Organization", type: "text" },
  { key: "date_range", label: "Date range", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function PositionsPage() {
  return (
    <CrudManager
      table="positions_of_responsibility"
      title="Positions of Responsibility"
      fields={FIELDS}
      primaryKeys={["title", "organization"]}
    />
  );
}
