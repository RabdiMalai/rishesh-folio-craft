import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messages")({ component: MessagesPage });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function MessagesPage() {
  const queryClient = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["admin", "contact_messages"],
    queryFn: async () => {
      const { data, error } = await db
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "contact_messages"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const setRead = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await db.from("contact_messages").update({ is_read: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Message deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <h1 className="text-2xl text-foreground">Messages</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Enquiries submitted through the contact form.</p>

      <div className="mt-8">
        {isPending ? (
          <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : isError ? (
          <p className="py-12 text-sm text-destructive">Could not load messages.</p>
        ) : !data?.length ? (
          <div className="border border-dashed border-border px-6 py-14 text-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        ) : (
          <ul className="border-t border-border">
            {data.map((m) => {
              const open = openId === m.id;
              return (
                <li key={m.id} className="border-b border-border py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenId(open ? null : m.id);
                        if (!open && !m.is_read) setRead.mutate({ id: m.id, value: true });
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className={`truncate text-sm ${m.is_read ? "text-muted-foreground" : "text-foreground"}`}>
                        {m.subject || "(no subject)"}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {m.name} · {m.email} · {new Date(m.created_at).toLocaleString()}
                      </p>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={m.is_read ? "Mark as unread" : "Mark as read"}
                        onClick={() => setRead.mutate({ id: m.id, value: !m.is_read })}
                        className={`p-1.5 ${m.is_read ? "text-muted-foreground" : "text-accent"} hover:text-foreground`}
                      >
                        {m.is_read ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                      </button>
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "")}`}
                        className="px-2 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase hover:text-accent"
                      >
                        Reply
                      </a>
                      <button
                        type="button"
                        aria-label="Delete message"
                        onClick={() => remove.mutate(m.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {open ? (
                    <p className="mt-4 max-w-2xl text-sm whitespace-pre-wrap text-foreground">{m.message}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
