"use strict";

const nodemailer = require("nodemailer");
const { z } = require("zod");
const sanitizeHtml = require("sanitize-html");
const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

// ======================
// ENV
// ======================

const {
  ZOHO_EMAIL,
  ZOHO_APP_PASSWORD,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
} = process.env;

const allowedOrigins = [
  "https://www.microlineindia.in",
  "https://microlineindia.in",
  "http://localhost:5173"
];

// ======================
// Redis + Rate Limit
// ======================

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true,
});

// ======================
// Schema
// ======================

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),

  website: z.string().max(0).optional(), // honeypot
  "cf-turnstile-response": z.string().min(1),

  loadedAt: z.number().optional(),
});

// ======================
// Helper: IP
// ======================

function getIP(req) {
  return (
    (req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// ======================
// MAIN HANDLER
// ======================

module.exports = async (req, res) => {
  const origin = req.headers.origin;

  // ======================
  // CORS preflight
  // ======================

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    });
    return res.end();
  }

  // ======================
  // Block invalid origin
  // ======================

  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.writeHead(403, {
      "Content-Type": "application/json",
    }).end(JSON.stringify({ error: "Forbidden origin" }));
  }

  // ======================
  // Headers
  // ======================

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Vary", "Origin");

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");

  // ======================
  // Method check
  // ======================

  if (req.method !== "POST") {
    return res
      .writeHead(405, { "Content-Type": "application/json" })
      .end(JSON.stringify({ error: "Method not allowed" }));
  }

  try {
    const ip = getIP(req);

    // ======================
    // Rate limit
    // ======================

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return res
        .writeHead(429, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: "Too many requests" }));
    }

    // ======================
    // Parse body
    // ======================

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    // ======================
    // Honeypot
    // ======================

    if (body.website?.length > 0) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "Spam detected" }));
    }

    // ======================
    // Timing check
    // ======================

    if (body.loadedAt && Date.now() - body.loadedAt < 3000) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "Suspicious submission" }));
    }

    // ======================
    // Validation
    // ======================

    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return res
        .writeHead(400)
        .end(JSON.stringify({
          error: "Invalid form data",
          details: parsed.error.issues,
        }));
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      "cf-turnstile-response": token,
    } = parsed.data;

    // ======================
    // Turnstile verify (FIXED)
    // ======================

    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      return res
        .writeHead(400)
        .end(JSON.stringify({ error: "Turnstile failed" }));
    }

    // ======================
    // Sanitize
    // ======================

    const cleanMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {},
    });

    // ======================
    // SMTP
    // ======================

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${ZOHO_EMAIL}>`,
      to: ZOHO_EMAIL,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${cleanMessage}
      `,
      html: `
        <h2>New Contact</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p>${cleanMessage}</p>
      `,
    });

    return res
      .writeHead(200, { "Content-Type": "application/json" })
      .end(JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }));

  } catch (err) {
    console.error("CONTACT API ERROR:", err);

    return res
      .writeHead(500)
      .end(JSON.stringify({ error: "Internal server error" }));
  }
};