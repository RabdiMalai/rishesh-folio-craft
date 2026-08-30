import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/resume")({ component: ResumePage });

const FIELDS: Field[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "file_path", label: "Resume file", type: "file", bucket: "resumes", full: true },
  { key: "file_name", label: "Download file name", type: "text" },
  { key: "display_order", label: "Order", type: "number" },
  { key: "is_active", label: "Visible", type: "boolean" },
];

function ResumePage() {
  return (
    <CrudManager
      table="resumes"
      title="Resume"
      description="Upload a PDF. The first visible resume powers the download buttons."
      fields={FIELDS}
      primaryKeys={["label"]}
    />
  );
}
