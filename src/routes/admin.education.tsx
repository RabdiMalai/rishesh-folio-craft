import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/education")({ component: EducationPage });

const FIELDS: Field[] = [
  { key: "institution", label: "Institution", type: "text" },
  { key: "degree", label: "Degree", type: "text" },
  { key: "field", label: "Field of study", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "start_year", label: "Start year", type: "text" },
  { key: "end_year", label: "End year", type: "text" },
  { key: "score", label: "Score", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function EducationPage() {
  return (
    <CrudManager
      table="education"
      title="Education"
      fields={FIELDS}
      primaryKeys={["institution", "degree"]}
    />
  );
}
