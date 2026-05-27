import { useDeferredValue, useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Inquiry = Tables<"appointment_inquiries">;

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];
type InquiryStatus = Exclude<StatusFilter, "all">;

const statusClasses: Record<InquiryStatus, string> = {
  new: "border-amber-200 bg-amber-50 text-amber-800",
  contacted: "border-sky-200 bg-sky-50 text-sky-800",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  completed: "border-violet-200 bg-violet-50 text-violet-800",
  cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};

const summaryCards: { key: InquiryStatus | "total"; label: string }[] = [
  { key: "total", label: "Total requests" },
  { key: "new", label: "New" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
];

const normalizeStatus = (value: string | null | undefined): InquiryStatus => {
  if (value === "contacted" || value === "confirmed" || value === "completed" || value === "cancelled") {
    return value;
  }

  return "new";
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-TT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const formatDateOnly = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("en-TT", {
        dateStyle: "full",
      }).format(new Date(value))
    : "No preferred date selected";

function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <Badge className={cn("rounded-full border px-3 py-1 font-body text-[11px] uppercase tracking-[0.2em]", statusClasses[status])}>
      {status}
    </Badge>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<InquiryStatus>("new");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(currentSession);
      setAuthReady(true);
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      setAuthReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadInquiries = async () => {
    if (!session) {
      return;
    }

    setLoadingInquiries(true);

    const { data, error } = await supabase
      .from("appointment_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    setLoadingInquiries(false);

    if (error) {
      toast.error("Your account can sign in, but it is not allowed to view admin booking data yet.");
      return;
    }

    setInquiries(data ?? []);
  };

  useEffect(() => {
    if (!session) {
      setInquiries([]);
      setSelectedInquiryId(null);
      return;
    }

    void loadInquiries();
  }, [session]);

  const searchTerm = deferredSearch.trim().toLowerCase();
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus = statusFilter === "all" || normalizeStatus(inquiry.status) === statusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!searchTerm) {
      return true;
    }

    const searchableText = [
      inquiry.name,
      inquiry.email,
      inquiry.phone,
      inquiry.service,
      inquiry.message ?? "",
      inquiry.admin_notes ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  const activeInquiry = filteredInquiries.find((inquiry) => inquiry.id === selectedInquiryId) ?? filteredInquiries[0] ?? null;

  useEffect(() => {
    if (!activeInquiry) {
      setNotesDraft("");
      setStatusDraft("new");
      return;
    }

    if (selectedInquiryId !== activeInquiry.id) {
      setSelectedInquiryId(activeInquiry.id);
    }

    setNotesDraft(activeInquiry.admin_notes ?? "");
    setStatusDraft(normalizeStatus(activeInquiry.status));
  }, [activeInquiry?.id]);

  const counts = {
    total: inquiries.length,
    new: 0,
    contacted: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const inquiry of inquiries) {
    counts[normalizeStatus(inquiry.status)] += 1;
  }

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const isNetworkError =
          error.message.toLowerCase().includes("fetch") ||
          error.message.toLowerCase().includes("network") ||
          error.message.toLowerCase().includes("failed to");

        toast.error(
          isNetworkError
            ? "Unable to reach the server. The service may be temporarily unavailable — please try again in a moment."
            : error.message
        );
        return;
      }

      setPassword("");
      toast.success("Admin access unlocked.");
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError && err.message.toLowerCase().includes("fetch");

      toast.error(
        isNetworkError
          ? "Unable to reach the server. The service may be temporarily unavailable — please try again in a moment."
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed out.");
  };

  const handleSave = async () => {
    if (!activeInquiry) {
      return;
    }

    setSaving(true);

    const payload = {
      status: statusDraft,
      admin_notes: notesDraft.trim() || null,
    };

    const { data, error } = await supabase
      .from("appointment_inquiries")
      .update(payload)
      .eq("id", activeInquiry.id)
      .select("*")
      .single();

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setInquiries((current) => current.map((inquiry) => (inquiry.id === data.id ? data : inquiry)));
    toast.success("Booking request updated.");
  };

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-full border border-border bg-card px-6 py-3 text-sm text-muted-foreground shadow-sm">
          Preparing the booking desk...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,hsl(var(--warm-cream)),hsl(var(--warm-blush))_50%,hsl(var(--secondary)))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-8rem] top-[-5rem] h-64 w-64 rounded-full bg-white/50 blur-3xl" />
          <div className="absolute bottom-[-8rem] right-[-5rem] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-[18%] top-[12%] h-40 w-40 rounded-full bg-warm-gold/20 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Badge className="rounded-full border-white/40 bg-white/60 px-4 py-1.5 font-body text-[11px] uppercase tracking-[0.28em] text-primary shadow-sm backdrop-blur">
              UI UX Pro Max inspired
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-xl font-display text-5xl leading-tight text-charcoal sm:text-6xl">
                The Reinvention booking desk, styled like part of the brand.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-foreground/75 sm:text-lg">
                This admin space follows the calm premium direction recommended for beauty and wellness: soft depth,
                warm neutrals, gold accents, and clear action paths for real appointment handling.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-white/60 bg-white/65 shadow-[0_20px_60px_rgba(77,60,44,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
                  <div className="font-display text-2xl text-charcoal">Private access</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Only approved admin accounts can view and update requests.</p>
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/65 shadow-[0_20px_60px_rgba(77,60,44,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <CalendarDays className="mb-4 h-6 w-6 text-primary" />
                  <div className="font-display text-2xl text-charcoal">Booking triage</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Sort new requests fast, then move them through your salon workflow.</p>
                </CardContent>
              </Card>
              <Card className="border-white/60 bg-white/65 shadow-[0_20px_60px_rgba(77,60,44,0.08)] backdrop-blur">
                <CardContent className="p-6">
                  <Sparkles className="mb-4 h-6 w-6 text-primary" />
                  <div className="font-display text-2xl text-charcoal">Brand matched</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">The dashboard feels like the front-end site instead of a generic back office.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Card className="border-white/60 bg-white/75 shadow-[0_30px_80px_rgba(32,26,22,0.12)] backdrop-blur">
            <CardHeader className="space-y-3">
              <Badge className="w-fit rounded-full border-primary/20 bg-primary/10 px-3 py-1 font-body text-[11px] uppercase tracking-[0.22em] text-primary">
                Admin sign in
              </Badge>
              <CardTitle className="font-display text-4xl text-charcoal">Manage booking requests</CardTitle>
              <CardDescription className="text-sm leading-6 text-muted-foreground">
                Sign in with the Supabase admin account you created for the salon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSignIn}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-charcoal" htmlFor="admin-email">
                    Admin email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="owner@reinventionbeautybar.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-xl border-white/70 bg-white/80"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-charcoal" htmlFor="admin-password">
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-xl border-white/70 bg-white/80"
                    required
                  />
                </div>
                <Button className="h-12 w-full rounded-xl font-body uppercase tracking-[0.2em]" disabled={signingIn} type="submit">
                  <LogIn className="mr-1 h-4 w-4" />
                  {signingIn ? "Signing in..." : "Open admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,hsl(var(--warm-cream)),hsl(var(--secondary))_40%,hsl(var(--background)))] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden border-white/60 bg-white/75 shadow-[0_24px_70px_rgba(32,26,22,0.08)] backdrop-blur">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-3">
              <Badge className="w-fit rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 font-body text-[11px] uppercase tracking-[0.24em] text-primary">
                Reinvention admin
              </Badge>
              <div>
                <h1 className="font-display text-4xl text-charcoal sm:text-5xl">Appointment requests</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Review inquiries, leave private notes, and move each request from new lead to confirmed booking.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button variant="outline" className="rounded-xl border-white/80 bg-white/70" onClick={() => void loadInquiries()}>
                <RefreshCcw className={cn("h-4 w-4", loadingInquiries && "animate-spin")} />
                Refresh
              </Button>
              <Button variant="outline" className="rounded-xl border-white/80 bg-white/70" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.key} className="border-white/60 bg-white/70 shadow-[0_18px_55px_rgba(32,26,22,0.06)]">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
                <div className="mt-3 font-display text-4xl text-charcoal">
                  {card.key === "total" ? counts.total : counts[card.key]}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card className="border-white/60 bg-white/72 shadow-[0_20px_60px_rgba(32,26,22,0.07)]">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by client, service, or note"
                    className="h-12 rounded-xl border-white/80 bg-white pl-11"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                        statusFilter === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                      onClick={() => setStatusFilter(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-3xl text-charcoal">Booking queue</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                    {filteredInquiries.length} request{filteredInquiries.length === 1 ? "" : "s"} match the current filters.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingInquiries ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
                  Loading booking requests...
                </div>
              ) : null}

              {!loadingInquiries && filteredInquiries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
                  No requests match this filter yet.
                </div>
              ) : null}

              {!loadingInquiries &&
                filteredInquiries.map((inquiry) => {
                  const inquiryStatus = normalizeStatus(inquiry.status);
                  const isActive = inquiry.id === activeInquiry?.id;

                  return (
                    <button
                      key={inquiry.id}
                      className={cn(
                        "w-full cursor-pointer rounded-2xl border p-4 text-left transition-all",
                        isActive
                          ? "border-primary bg-primary/5 shadow-[0_16px_45px_rgba(77,60,44,0.12)]"
                          : "border-white/70 bg-white/80 hover:border-primary/40 hover:bg-white",
                      )}
                      onClick={() => setSelectedInquiryId(inquiry.id)}
                      type="button"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-2xl text-charcoal">{inquiry.name}</span>
                            <StatusBadge status={inquiryStatus} />
                          </div>
                          <p className="text-sm font-medium text-foreground/80">{inquiry.service}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            <span>{formatDateTime(inquiry.created_at)}</span>
                            <span>{inquiry.preferred_date ? formatDateOnly(inquiry.preferred_date) : "No date selected"}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {inquiry.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {inquiry.phone}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </CardContent>
          </Card>

          <Card className="border-white/60 bg-white/74 shadow-[0_22px_60px_rgba(32,26,22,0.08)]">
            <CardHeader>
              <CardTitle className="font-display text-3xl text-charcoal">Request details</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                Review the inquiry, contact the client, then save the current booking status and private notes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeInquiry ? (
                <div className="rounded-2xl border border-dashed border-border bg-background/70 px-4 py-14 text-center text-sm text-muted-foreground">
                  Select a booking request to manage it here.
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-[1.5rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(255,247,240,0.92))] p-5 shadow-[0_20px_50px_rgba(77,60,44,0.08)]">
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div>
                            <h2 className="font-display text-3xl text-charcoal">{activeInquiry.name}</h2>
                            <p className="text-sm text-muted-foreground">{activeInquiry.service}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <StatusBadge status={normalizeStatus(activeInquiry.status)} />
                          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            Submitted {formatDateTime(activeInquiry.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button asChild className="rounded-xl">
                          <a href={`tel:${activeInquiry.phone}`}>
                            <Phone className="h-4 w-4" />
                            Call client
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl border-primary/20 bg-white/70">
                          <a href={`mailto:${activeInquiry.email}`}>
                            <Mail className="h-4 w-4" />
                            Email client
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/70 bg-background/70 shadow-none">
                      <CardContent className="space-y-3 p-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                          <CalendarDays className="h-4 w-4 text-primary" />
                          Preferred date
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{formatDateOnly(activeInquiry.preferred_date)}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/70 bg-background/70 shadow-none">
                      <CardContent className="space-y-3 p-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                          <Clock3 className="h-4 w-4 text-primary" />
                          Last updated
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">{formatDateTime(activeInquiry.updated_at)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-charcoal">Client message</div>
                    <div className="rounded-2xl border border-border bg-background/80 p-4 text-sm leading-7 text-muted-foreground">
                      {activeInquiry.message?.trim() || "No extra notes were submitted with this request."}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-charcoal">Update status</div>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => {
                        const optionValue = option.value as InquiryStatus;
                        const isSelected = statusDraft === optionValue;

                        return (
                          <button
                            key={optionValue}
                            className={cn(
                              "cursor-pointer rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground",
                            )}
                            onClick={() => setStatusDraft(optionValue)}
                            type="button"
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-charcoal">Private admin notes</div>
                    <Textarea
                      value={notesDraft}
                      onChange={(event) => setNotesDraft(event.target.value)}
                      placeholder="Add contact notes, trial details, deposit reminders, or follow-up actions..."
                      className="min-h-[180px] rounded-2xl border-white/70 bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-xl" disabled={saving} onClick={handleSave} type="button">
                      <CheckCircle2 className="h-4 w-4" />
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                      onClick={() => setStatusDraft("cancelled")}
                      type="button"
                    >
                      <XCircle className="h-4 w-4" />
                      Mark cancelled
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
