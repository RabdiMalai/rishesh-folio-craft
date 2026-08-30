import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, useTable, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/skills")({ component: SkillsPage });

const CATEGORY_FIELDS: Field[] = [
  { key: "name", label: "Category name", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function SkillsPage() {
  const { data: categories } = useTable("skill_categories");
  const options = (categories ?? []).map((c) => ({ value: String(c["id"]), label: String(c["name"]) }));
  const nameById = new Map(options.map((o) => [o.value, o.label]));

  const skillFields: Field[] = [
    { key: "name", label: "Skill", type: "text" },
    { key: "category_id", label: "Category", type: "select", options },
    { key: "level", label: "Level", type: "text", help: "Optional, e.g. Advanced" },
    { key: "display_order", label: "Order", type: "number" },
    { key: "is_active", label: "Visible", type: "boolean" },
  ];

  return (
    <div className="space-y-16">
      <CrudManager
        table="skill_categories"
        title="Skill Categories"
        description="Groupings used on the public skills section."
        fields={CATEGORY_FIELDS}
        primaryKeys={["name"]}
      />
      <CrudManager
        table="skills"
        title="Skills"
        description="Individual skills, each assigned to a category."
        fields={skillFields}
        primaryKeys={["name"]}
        searchKeys={["name", "level"]}
        renderExtra={(row) => nameById.get(String(row["category_id"])) ?? "Uncategorised"}
      />
    </div>
  );
}
