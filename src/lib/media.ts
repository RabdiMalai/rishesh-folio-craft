import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Bucket = "profile-images" | "project-images" | "logos" | "certificates" | "resumes";

const YEAR = 60 * 60 * 24 * 365;

/** Stored media references look like "bucket:path/to/file.png" or a plain https URL. */
export function isStorageRef(value?: string | null) {
  return !!value && !/^https?:\/\//.test(value) && value.includes(":");
}

export async function resolveMediaUrl(value?: string | null): Promise<string | null> {
  if (!value) return null;
  if (!isStorageRef(value)) return value;
  const idx = value.indexOf(":");
  const bucket = value.slice(0, idx);
  const path = value.slice(idx + 1);
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, YEAR);
  return data?.signedUrl ?? null;
}

export function useMediaUrl(value?: string | null) {
  const [url, setUrl] = useState<string | null>(isStorageRef(value) ? null : (value ?? null));

  useEffect(() => {
    let cancelled = false;
    resolveMediaUrl(value).then((resolved) => {
      if (!cancelled) setUrl(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return url;
}

export async function uploadMedia(bucket: Bucket, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw error;
  return `${bucket}:${path}`;
}

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"];
export const DOC_TYPES = [...IMAGE_TYPES, "application/pdf"];

export function validateFile(file: File, accepted: string[], maxMb = 10) {
  if (accepted.length && !accepted.includes(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}`;
  }
  if (file.size > maxMb * 1024 * 1024) return `File must be smaller than ${maxMb}MB`;
  return null;
}
