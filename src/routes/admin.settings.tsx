import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

const FIELDS: Field[] = [
  { key: "site_title", label: "Site title", type: "text" },
  { key: "meta_title", label: "Meta title", type: "text" },
  { key: "meta_description", label: "Meta description", type: "textarea" },
  { key: "og_image_url", label: "Social share image", type: "image", bucket: "project-images", full: true },
  { key: "favicon_url", label: "Favicon", type: "image", bucket: "logos" },
  { key: "contact_email", label: "Contact email", type: "text" },
  { key: "footer_text", label: "Footer text", type: "textarea" },
  { key: "copyright", label: "Copyright", type: "text" },
  { key: "default_theme", label: "Default theme", type: "select", options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }] },
];

function SettingsPage() {
  return (
    <CrudManager
      table="site_settings"
      title="Site Settings"
      description="Metadata, footer and defaults for the public site."
      fields={FIELDS}
      primaryKeys={["site_title"]}
      singleton
    />
  );
}
