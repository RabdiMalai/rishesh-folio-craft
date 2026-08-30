import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/projects")({ component: ProjectsPage });

const FIELDS: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "status", label: "Status", type: "text" },
  { key: "start_date", label: "Start date", type: "text" },
  { key: "end_date", label: "End date", type: "text" },
  { key: "cover_image_url", label: "Cover image", type: "image", bucket: "project-images", full: true },
  { key: "description", label: "Short description", type: "textarea" },
  { key: "overview", label: "Overview", type: "textarea" },
  { key: "problem", label: "Problem", type: "textarea" },
  { key: "solution", label: "Solution", type: "textarea" },
  { key: "contribution", label: "My contribution", type: "textarea" },
  { key: "features", label: "Features", type: "list", help: "One per line" },
  { key: "technologies", label: "Technologies", type: "list", help: "One per line" },
  { key: "metrics", label: "Metrics", type: "metrics", help: "One per line as: Label = Value" },
  { key: "github_url", label: "GitHub URL", type: "text" },
  { key: "live_url", label: "Live URL", type: "text" },
  { key: "docs_url", label: "Docs URL", type: "text" },
  { key: "is_featured", label: "Featured", type: "boolean" },
  { key: "is_published", label: "Published", type: "boolean" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function ProjectsPage() {
  return (
    <CrudManager
      table="projects"
      title="Projects"
      description="Case studies shown on the public site. Only published projects are visible."
      fields={FIELDS}
      primaryKeys={["title"]}
      searchKeys={["title", "category", "slug"]}
      renderExtra={(row) => [row["category"], row["status"]].filter(Boolean).join(" · ")}
    />
  );
}
