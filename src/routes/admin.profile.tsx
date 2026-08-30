import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type Field } from "@/components/admin/crud";

export const Route = createFileRoute("/admin/profile")({ component: ProfilePage });

const FIELDS: Field[] = [
  { key: "full_name", label: "Full name", type: "text" },
  { key: "professional_title", label: "Professional title", type: "text", help: "Separate segments with ·" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "current_status", label: "Current status", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "profile_image_url", label: "Profile image", type: "image", bucket: "profile-images", full: true },
  { key: "short_description", label: "Short description", type: "textarea" },
  { key: "about_heading", label: "About heading", type: "text" },
  { key: "summary", label: "Summary", type: "textarea" },
  { key: "biography", label: "Biography", type: "textarea" },
  { key: "professional_focus", label: "Professional focus", type: "textarea" },
];

function ProfilePage() {
  return (
    <CrudManager
      table="profiles"
      title="Profile"
      description="The identity shown across the hero, about section and footer."
      fields={FIELDS}
      primaryKeys={["full_name", "professional_title"]}
      singleton
    />
  );
}
