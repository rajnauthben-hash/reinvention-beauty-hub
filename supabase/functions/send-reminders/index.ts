import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Auto-injected by Supabase — no manual setup needed for these two
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "";
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "onboarding@resend.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email to", to);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) console.error("Resend error:", res.status, await res.text());
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-TT", { dateStyle: "full" }).format(
    new Date(value + "T12:00:00")
  );
}

function clientReminderHtml(name: string, service: string, date: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf8f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;padding:40px 16px;">
<tr><td align="center"><table width="100%" style="max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(100,60,40,0.08);">
  <tr><td style="background:linear-gradient(135deg,#c4918c 0%,#e8b4b0 100%);padding:40px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.85);font-family:Georgia,serif;">Reinvention Beauty Bar</p>
    <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#fff;">Your appointment is tomorrow!</h1>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="margin:0 0 16px;font-size:15px;color:#5a4a42;line-height:1.7;">Hi ${name},</p>
    <p style="margin:0 0 28px;font-size:15px;color:#5a4a42;line-height:1.7;">
      Just a friendly reminder — your appointment at Reinvention Beauty Bar is <strong style="color:#3d2c26;">tomorrow!</strong>
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;border-radius:8px;border:1px solid #f0e0da;margin-bottom:28px;">
      <tr><td style="padding:24px;">
        <p style="margin:0 0 14px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c4918c;font-weight:600;">Appointment Details</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:5px 0;font-size:13px;color:#9a8880;width:130px;">Service</td><td style="padding:5px 0;font-size:13px;color:#3d2c26;font-weight:600;">${service}</td></tr>
          <tr><td style="padding:5px 0;font-size:13px;color:#9a8880;">Date</td><td style="padding:5px 0;font-size:13px;color:#3d2c26;font-weight:600;">${formatDate(date)}</td></tr>
        </table>
      </td></tr>
    </table>
    <p style="margin:0 0 8px;font-size:14px;color:#5a4a42;line-height:1.7;">Need to reschedule? Reach us at:</p>
    <p style="margin:0 0 28px;font-size:15px;color:#5a4a42;">
      <a href="tel:+18687230123" style="color:#c4918c;text-decoration:none;font-weight:600;">(868) 723-0123</a>
    </p>
    <p style="margin:0;font-size:15px;color:#5a4a42;line-height:1.7;">See you tomorrow,<br><strong style="color:#3d2c26;">Reinvention Beauty Bar</strong></p>
  </td></tr>
  <tr><td style="background:#fdf8f5;border-top:1px solid #f0e0da;padding:20px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#b09a94;">Port of Spain, Trinidad &nbsp;·&nbsp; (868) 723-0123</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

function adminReminderHtml(
  appointments: Array<{ name: string; service: string; preferred_date: string; phone: string; email: string }>
): string {
  const rows = appointments
    .map(
      (a) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0e0da;font-size:13px;color:#3d2c26;font-weight:600;">${a.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e0da;font-size:13px;color:#5a4a42;">${a.service}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e0da;font-size:13px;color:#5a4a42;">${formatDate(a.preferred_date)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e0da;font-size:13px;">
          <a href="tel:${a.phone}" style="color:#c4918c;text-decoration:none;">${a.phone}</a>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf8f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;padding:40px 16px;">
<tr><td align="center"><table width="100%" style="max-width:640px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(100,60,40,0.08);">
  <tr><td style="background:#3d2c26;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Tomorrow's Schedule</p>
    <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#fff;">${appointments.length} Appointment${appointments.length > 1 ? "s" : ""} Tomorrow</h1>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="margin:0 0 24px;font-size:15px;color:#5a4a42;line-height:1.7;">
      You have <strong>${appointments.length}</strong> confirmed appointment${appointments.length > 1 ? "s" : ""} scheduled for <strong>tomorrow</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <th style="padding:8px 0;text-align:left;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c4918c;border-bottom:2px solid #f0e0da;">Client</th>
        <th style="padding:8px 0;text-align:left;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c4918c;border-bottom:2px solid #f0e0da;">Service</th>
        <th style="padding:8px 0;text-align:left;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c4918c;border-bottom:2px solid #f0e0da;">Date</th>
        <th style="padding:8px 0;text-align:left;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c4918c;border-bottom:2px solid #f0e0da;">Phone</th>
      </tr>
      ${rows}
    </table>
    <br>
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="https://reinvention-beauty-hub.vercel.app/admin" style="display:inline-block;background:#c4918c;color:#fff;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">Open Admin Dashboard</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="background:#fdf8f5;border-top:1px solid #f0e0da;padding:20px 40px;text-align:center;">
    <p style="margin:0;font-size:12px;color:#b09a94;">Reinvention Beauty Bar · Admin Notifications</p>
  </td></tr>
</table></td></tr></table>
</body></html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const d = new Date();
    d.setDate(d.getDate() + 1);
    const tomorrowStr = d.toISOString().split("T")[0];

    const { data: appointments, error } = await supabase
      .from("appointment_inquiries")
      .select("name, email, phone, service, preferred_date")
      .eq("status", "confirmed")
      .eq("preferred_date", tomorrowStr);

    if (error) {
      console.error("DB error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }

    if (!appointments || appointments.length === 0) {
      console.log("No confirmed appointments tomorrow — nothing to send.");
      return new Response(JSON.stringify({ sent: 0 }), { headers: corsHeaders });
    }

    const emailJobs: Promise<void>[] = [];

    // Individual reminder to each client
    for (const appt of appointments) {
      emailJobs.push(
        sendEmail(
          appt.email,
          "Reminder: Your appointment is tomorrow — Reinvention Beauty Bar",
          clientReminderHtml(appt.name, appt.service, appt.preferred_date)
        )
      );
    }

    // Digest summary to owner
    emailJobs.push(
      sendEmail(
        ADMIN_EMAIL,
        `${appointments.length} appointment${appointments.length > 1 ? "s" : ""} tomorrow — Reinvention Beauty Bar`,
        adminReminderHtml(appointments)
      )
    );

    await Promise.all(emailJobs);

    return new Response(
      JSON.stringify({ sent: appointments.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-reminders error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
