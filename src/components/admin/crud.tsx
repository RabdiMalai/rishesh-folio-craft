import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Copy, Loader2, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, useMediaUrl, validateFile, DOC_TYPES, IMAGE_TYPES, type Bucket } from "@/lib/media";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "list"
  | "metrics"
  | "image"
  | "file"
  | "select";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  bucket?: Bucket;
  options?: { value: string; label: string }[];
  full?: boolean;
};

export function useTable(table: string, order: string | null = "display_order") {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let query = db.from(table).select("*");
      if (order) query = query.order(order, { ascending: true });
      const { data, error } = await query.order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });
}

/* ------------------------------- inputs ------------------------------- */

const inputClass =
  "w-full border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent";

function FileField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const preview = useMediaUrl(value);
  const isImage = field.type === "image";

  async function handleFile(file: File) {
    const error = validateFile(file, isImage ? IMAGE_TYPES : DOC_TYPES, 20);
    if (error) {
      toast.error(error);
      return;
    }
    setBusy(true);
    try {
      const ref = await uploadMedia(field.bucket ?? "project-images", file);
      onChange(ref);
      toast.success("File uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 border border-input px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
          <input
            type="file"
            className="hidden"
            accept={isImage ? IMAGE_TYPES.join(",") : DOC_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>
        {value ? (
          <button type="button" onClick={() => onChange("")} className="text-sm text-muted-foreground hover:text-destructive">
            Remove
          </button>
        ) : null}
      </div>
      <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste a URL" />
      {preview && isImage ? <img src={preview} alt="" className="h-24 w-auto border border-border object-cover" /> : null}
      {preview && !isImage ? (
        <a href={preview} target="_blank" rel="noreferrer" className="text-sm text-accent">
          Open current file
        </a>
      ) : null}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={4}
          className={`${inputClass} resize-y`}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "boolean":
      return (
        <label className="inline-flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          {field.label}
        </label>
      );
    case "number":
      return (
        <input
          type="number"
          className={inputClass}
          value={(value as number) ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );
    case "list":
      return (
        <textarea
          rows={3}
          className={`${inputClass} resize-y`}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      );
    case "metrics":
      return (
        <textarea
          rows={3}
          className={`${inputClass} resize-y font-mono text-xs`}
          value={Array.isArray(value) ? (value as { label: string; value: string }[]).map((m) => `${m.label} = ${m.value}`).join("\n") : ""}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((line) => line.split("="))
                .filter((parts) => parts.length >= 2)
                .map((parts) => ({ label: parts[0]!.trim(), value: parts.slice(1).join("=").trim() })),
            )
          }
        />
      );
    case "select":
      return (
        <select className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "image":
    case "file":
      return <FileField field={field} value={(value as string) ?? ""} onChange={onChange} />;
    default:
      return <input className={inputClass} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

/* ------------------------------- editor ------------------------------- */

function Editor({
  title,
  fields,
  initial,
  onCancel,
  onSave,
  saving,
}: {
  title: string;
  fields: Field[];
  initial: Row;
  onCancel: () => void;
  onSave: (values: Row) => void;
  saving: boolean;
}) {
  const [values, setValues] = useState<Row>(initial);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="border border-border bg-card p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl text-foreground">{title}</h3>
            <button type="button" onClick={onCancel} aria-label="Close" className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            className="mt-8 grid gap-6 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSave(values);
            }}
          >
            {fields.map((field) => (
              <div key={field.key} className={field.full || field.type === "textarea" || field.type === "list" || field.type === "metrics" ? "sm:col-span-2" : ""}>
                {field.type !== "boolean" ? (
                  <label className="label-xs mb-2 block" htmlFor={field.key}>
                    {field.label}
                  </label>
                ) : null}
                <FieldInput field={field} value={values[field.key]} onChange={(v) => setValues({ ...values, [field.key]: v })} />
                {field.help ? <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p> : null}
              </div>
            ))}

            <div className="flex items-center gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save
              </button>
              <button type="button" onClick={onCancel} className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- CRUD manager ---------------------------- */

export function CrudManager({
  table,
  title,
  description,
  fields,
  primaryKeys,
  defaults = {},
  searchKeys,
  singleton,
  renderExtra,
  order = "display_order",
}: {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  primaryKeys: string[];
  defaults?: Row;
  searchKeys?: string[];
  singleton?: boolean;
  renderExtra?: (row: Row) => ReactNode;
  order?: string;
}) {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useTable(table, order);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", table] });
    void queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const save = useMutation({
    mutationFn: async (values: Row) => {
      const payload: Row = {};
      fields.forEach((field) => {
        payload[field.key] = values[field.key] ?? (field.type === "list" || field.type === "metrics" ? [] : field.type === "boolean" ? false : field.type === "number" ? 0 : "");
      });
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });
      if (values["id"]) {
        const { error } = await db.from(table).update(payload).eq("id", values["id"]);
        if (error) throw error;
      } else {
        const { error } = await db.from(table).insert({ ...defaults, ...payload });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      setCreating(false);
      toast.success("Saved");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setConfirmId(null);
      toast.success("Deleted");
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete"),
  });

  const reorder = useMutation({
    mutationFn: async ({ row, direction }: { row: Row; direction: -1 | 1 }) => {
      const rows = [...(data ?? [])];
      const index = rows.findIndex((r) => r["id"] === row["id"]);
      const target = rows[index + direction];
      if (!target) return;
      await db.from(table).update({ display_order: target["display_order"] }).eq("id", row["id"]);
      await db.from(table).update({ display_order: row["display_order"] }).eq("id", target["id"]);
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async ({ row, key }: { row: Row; key: string }) => {
      const { error } = await db.from(table).update({ [key]: !row[key] }).eq("id", row["id"]);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const duplicate = useMutation({
    mutationFn: async (row: Row) => {
      const copy: Row = { ...row };
      delete copy["id"];
      delete copy["created_at"];
      delete copy["updated_at"];
      copy["display_order"] = (row["display_order"] ?? 0) + 1;
      if (copy["title"]) copy["title"] = `${copy["title"]} (copy)`;
      if (copy["name"]) copy["name"] = `${copy["name"]} (copy)`;
      const { error } = await db.from(table).insert(copy);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Duplicated");
    },
  });

  const rows = useMemo(() => {
    if (!data) return [];
    const keys = searchKeys ?? primaryKeys;
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((row) => keys.some((key) => String(row[key] ?? "").toLowerCase().includes(term)));
  }, [data, search, searchKeys, primaryKeys]);

  const blank: Row = Object.fromEntries(
    fields.map((f) => [f.key, f.type === "list" || f.type === "metrics" ? [] : f.type === "boolean" ? true : f.type === "number" ? (data?.length ?? 0) + 1 : ""]),
  );

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">{title}</h1>
          {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {!singleton ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        ) : null}
      </header>

      {!singleton ? (
        <div className="relative mt-6 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className={`${inputClass} pl-9`}
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={`Search ${title}`}
          />
        </div>
      ) : null}

      <div className="mt-8">
        {isPending ? (
          <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : isError ? (
          <p className="py-12 text-sm text-destructive">Could not load {title.toLowerCase()}.</p>
        ) : !rows.length ? (
          <div className="border border-dashed border-border px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">
              {search ? "No matches for this search." : `No ${title.toLowerCase()} yet.`}
            </p>
            {!search && !singleton ? (
              <button type="button" onClick={() => setCreating(true)} className="mt-4 text-sm text-accent">
                Create the first entry
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="border-t border-border">
            {rows.map((row, i) => (
              <li key={row["id"]} className="flex flex-wrap items-start justify-between gap-4 border-b border-border py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{primaryKeys.map((key) => row[key]).filter(Boolean).join(" · ") || "Untitled"}</p>
                  {renderExtra ? <div className="mt-1 text-xs text-muted-foreground">{renderExtra(row)}</div> : null}
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {"is_active" in row ? (
                    <button
                      type="button"
                      onClick={() => toggle.mutate({ row, key: "is_active" })}
                      className={`px-2 py-1 font-mono text-[10px] tracking-wider uppercase ${row["is_active"] ? "text-accent" : "text-muted-foreground"}`}
                    >
                      {row["is_active"] ? "Visible" : "Hidden"}
                    </button>
                  ) : null}
                  {"is_published" in row ? (
                    <button
                      type="button"
                      onClick={() => toggle.mutate({ row, key: "is_published" })}
                      className={`px-2 py-1 font-mono text-[10px] tracking-wider uppercase ${row["is_published"] ? "text-accent" : "text-muted-foreground"}`}
                    >
                      {row["is_published"] ? "Published" : "Draft"}
                    </button>
                  ) : null}
                  {!singleton && "display_order" in row ? (
                    <>
                      <button
                        type="button"
                        disabled={i === 0}
                        aria-label="Move up"
                        onClick={() => reorder.mutate({ row, direction: -1 })}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={i === rows.length - 1}
                        aria-label="Move down"
                        onClick={() => reorder.mutate({ row, direction: 1 })}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : null}
                  {!singleton ? (
                    <button
                      type="button"
                      aria-label="Duplicate"
                      onClick={() => duplicate.mutate(row)}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    aria-label="Edit"
                    onClick={() => setEditing(row)}
                    className="p-1.5 text-muted-foreground hover:text-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {!singleton ? (
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => setConfirmId(row["id"])}
                      className="p-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editing ? (
        <Editor
          title={`Edit ${title}`}
          fields={fields}
          initial={editing}
          saving={save.isPending}
          onCancel={() => setEditing(null)}
          onSave={(values) => save.mutate({ ...values, id: editing["id"] })}
        />
      ) : null}

      {creating ? (
        <Editor
          title={`New ${title}`}
          fields={fields}
          initial={blank}
          saving={save.isPending}
          onCancel={() => setCreating(false)}
          onSave={(values) => save.mutate(values)}
        />
      ) : null}

      {confirmId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-border bg-card p-6">
            <h3 className="text-lg text-foreground">Delete this entry?</h3>
            <p className="mt-2 text-sm text-muted-foreground">This cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => remove.mutate(confirmId)}
                disabled={remove.isPending}
                className="inline-flex items-center gap-2 bg-destructive px-4 py-2 text-sm text-destructive-foreground disabled:opacity-60"
              >
                {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Delete
              </button>
              <button type="button" onClick={() => setConfirmId(null)} className="px-3 py-2 text-sm text-muted-foreground">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
