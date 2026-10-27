import "server-only";

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM!;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

if (!from) {
  throw new Error("EMAIL_FROM is not configured");
}

const resend = new Resend(apiKey);

function buildHtml(code: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 480px; margin: 0 auto; padding: 20px;">

      <!-- Header -->
      <div style="text-align: center; padding: 24px 0 16px;">
        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0;">
          Alumini
        </h1>
      </div>

      <!-- Body -->
      <div style="padding: 0 16px;">
        <p style="font-size: 15px; margin: 0 0 8px;">Hi there,</p>
        <p style="font-size: 15px; margin: 0 0 24px;">
          Use the code below to verify your account. It expires in <strong>10 minutes</strong>.
        </p>

        <!-- Code Box -->
        <div style="text-align: center; margin: 0 0 24px;">
          <div style="display: inline-block; padding: 16px 32px; background: #f4f4f5; border-radius: 10px; border: 1px solid #e4e4e7;">
            <span style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a; font-family: 'SF Mono', 'Fira Code', monospace;">
              ${code}
            </span>
          </div>
        </div>

        <p style="font-size: 13px; color: #71717a; margin: 0 0 8px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <p style="font-size: 13px; color: #71717a; margin: 0;">
          Need help? Reply to this email or contact support.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 32px 16px 16px; margin-top: 32px; border-top: 1px solid #e4e4e7;">
        <p style="font-size: 12px; color: #a1a1aa; margin: 0;">
          &copy; ${new Date().getFullYear()} Alumini. All rights reserved.
        </p>
      </div>

    </div>
  </div>`;
}

export async function sendVerificationCode(
  email: string,
  code: string,
) {
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: `Your Alumini verification code: ${code}`,
    text: `Your Alumini verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: buildHtml(code),
  });

  if (error) {
    console.error("Verification email delivery request failed", {
      name: error.name,
      statusCode: error.statusCode,
    });
    throw new Error("Unable to send verification email");
  }

  return data;
}   