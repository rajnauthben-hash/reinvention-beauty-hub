import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "benrajnauth@gmail.com";
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "onboarding@resend.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Booking {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferred_date?: string | null;
  message?: string | null;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
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

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", res.status, body);
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "To be confirmed";
  return new Intl.DateTimeFormat("en-TT", { dateStyle: "full" }).format(new Date(value));
}

function clientConfirmationHtml(b: Booking): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf8f5;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(100,60,40,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#c4918c 0%,#e8b4b0 100%);padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Reinvention Beauty Bar</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.3;">We got your request!</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:15px;color:#5a4a42;line-height:1.7;">
              Hi ${b.name},
            </p>
            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:#5a4a42;line-height:1.7;">
              Thank you for reaching out to Reinvention Beauty Bar. We've received your appointment request and will be in touch shortly to confirm the details.
            </p>

            <!-- Booking Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;border-radius:8px;border:1px solid #f0e0da;margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c4918c;font-weight:600;">Your Booking Summary</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#9a8880;width:120px;">Service</td>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#3d2c26;font-weight:600;">${b.service}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#9a8880;">Preferred Date</td>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#3d2c26;font-weight:600;">${formatDate(b.preferred_date)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#9a8880;">Phone</td>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#3d2c26;font-weight:600;">${b.phone}</td>
                  </tr>
                  ${b.message ? `<tr>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#9a8880;vertical-align:top;">Notes</td>
                    <td style="padding:6px 0;font-family:Arial,sans-serif;font-size:13px;color:#3d2c26;">${b.message}</td>
                  </tr>` : ""}
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;color:#5a4a42;line-height:1.7;">
              If you need to reach us sooner, call or WhatsApp us at <a href="tel:+18687230123" style="color:#c4918c;text-decoration:none;font-weight:600;">(868) 723-0123</a>.
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#5a4a42;line-height:1.7;">
              With love,<br>
              <strong style="color:#3d2c26;">The Reinvention Beauty Bar Team</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fdf8f5;border-top:1px solid #f0e0da;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#b09a94;">
              Port of Spain, Trinidad &nbsp;·&nbsp; (868) 723-0123<br>
              <a href="https://reinvention-beauty-hub.vercel.app" style="color:#c4918c;text-decoration:none;">reinventionbeautybar.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminAlertHtml(b: Booking): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf8f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(100,60,40,0.08);">

        <tr>
          <td style="background:#3d2c26;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.6);">Admin Alert</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#ffffff;">New Booking Request</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#5a4a42;line-height:1.7;">
              A new appointment request just came in from <strong style="color:#3d2c26;">${b.name}</strong>.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;border-radius:8px;border:1px solid #f0e0da;margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c4918c;font-weight:600;">Client Details</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;width:120px;">Name</td>
                    <td style="padding:5px 0;font-size:13px;color:#3d2c26;font-weight:600;">${b.name}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;">Email</td>
                    <td style="padding:5px 0;font-size:13px;"><a href="mailto:${b.email}" style="color:#c4918c;text-decoration:none;">${b.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;">Phone</td>
                    <td style="padding:5px 0;font-size:13px;"><a href="tel:${b.phone}" style="color:#c4918c;text-decoration:none;">${b.phone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;">Service</td>
                    <td style="padding:5px 0;font-size:13px;color:#3d2c26;font-weight:600;">${b.service}</td>
                  </tr>
                  <tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;">Preferred Date</td>
                    <td style="padding:5px 0;font-size:13px;color:#3d2c26;font-weight:600;">${formatDate(b.preferred_date)}</td>
                  </tr>
                  ${b.message ? `<tr>
                    <td style="padding:5px 0;font-size:13px;color:#9a8880;vertical-align:top;">Notes</td>
                    <td style="padding:5px 0;font-size:13px;color:#3d2c26;">${b.message}</td>
                  </tr>` : ""}
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="https://reinvention-beauty-hub.vercel.app/admin"
                   style="display:inline-block;background:#c4918c;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:6px;">
                  Open Admin Dashboard
                </a>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#fdf8f5;border-top:1px solid #f0e0da;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#b09a94;">Reinvention Beauty Bar · Admin Notifications</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function appointmentConfirmedHtml(b: Booking): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf8f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(100,60,40,0.08);">

        <tr>
          <td style="background:linear-gradient(135deg,#7a9e7e 0%,#a8c5aa 100%);padding:40px 40px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Reinvention Beauty Bar</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;line-height:1.3;">You're confirmed!</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 20px;font-size:15px;color:#5a4a42;line-height:1.7;">Hi ${b.name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:#5a4a42;line-height:1.7;">
              Great news — your appointment with Reinvention Beauty Bar is <strong style="color:#3d2c26;">confirmed</strong>. We're looking forward to seeing you!
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf8f5;border-radius:8px;border:1px solid #f0e0da;margin-bottom:28px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c4918c;font-weight:600;">Appointment Details</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#9a8880;width:120px;">Service</td>
                    <td style="padding:6px 0;font-size:13px;color:#3d2c26;font-weight:600;">${b.service}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-size:13px;color:#9a8880;">Date</td>
                    <td style="padding:6px 0;font-size:13px;color:#3d2c26;font-weight:600;">${formatDate(b.preferred_date)}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:0 0 12px;font-size:14px;color:#9a8880;line-height:1.7;">
              Need to reschedule or have questions? Reach us at:
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#5a4a42;line-height:1.7;">
              📞 <a href="tel:+18687230123" style="color:#c4918c;text-decoration:none;font-weight:600;">(868) 723-0123</a>
            </p>
            <p style="margin:0;font-size:15px;color:#5a4a42;line-height:1.7;">
              See you soon,<br>
              <strong style="color:#3d2c26;">Reinvention Beauty Bar</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background:#fdf8f5;border-top:1px solid #f0e0da;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#b09a94;">
              Port of Spain, Trinidad &nbsp;·&nbsp; (868) 723-0123<br>
              <a href="https://reinvention-beauty-hub.vercel.app" style="color:#c4918c;text-decoration:none;">reinventionbeautybar.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { type, booking }: { type: string; booking: Booking } = await req.json();

    if (type === "new_booking") {
      await Promise.all([
        sendEmail(
          booking.email,
          "We received your booking request — Reinvention Beauty Bar",
          clientConfirmationHtml(booking)
        ),
        sendEmail(
          ADMIN_EMAIL,
          `New booking request from ${booking.name}`,
          adminAlertHtml(booking)
        ),
      ]);
    } else if (type === "booking_confirmed") {
      await sendEmail(
        booking.email,
        "Your appointment is confirmed — Reinvention Beauty Bar",
        appointmentConfirmedHtml(booking)
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
