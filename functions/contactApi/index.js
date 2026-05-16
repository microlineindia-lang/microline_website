"use strict";

const nodemailer = require("nodemailer");
const { z } = require("zod");
const sanitizeHtml = require("sanitize-html");
const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

// ======================
// Environment Variables
// ======================

const {
  ZOHO_EMAIL,
  ZOHO_APP_PASSWORD,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  ALLOWED_ORIGIN
} = process.env;

// ======================
// Redis + Rate Limit
// ======================

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10 m"),
  analytics: true
});

// ======================
// Validation Schema
// ======================

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),

  // Honeypot
  website: z.string().max(0).optional(),

  // Turnstile token
  "cf-turnstile-response": z.string().min(1),

  loadedAt: z.number().optional()
});

// ======================
// Main Function
// ======================

module.exports = async (req, res) => {
  try {

    // ======================
    // CORS
    // ======================

    const origin = req.headers.origin;

    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    if (origin !== ALLOWED_ORIGIN) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "Forbidden origin"
      }));
    }

    // ======================
    // Allow only POST
    // ======================

    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "Method not allowed"
      }));
    }

    // ======================
    // Get IP
    // ======================

    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "unknown";

    // ======================
    // Rate Limiting
    // ======================

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "Too many requests"
      }));
    }

    // ======================
    // Parse Body
    // ======================

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    // ======================
    // Honeypot
    // ======================

    if (body.website && body.website.length > 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "Spam detected"
      }));
    }

    // ======================
    // Timing Check
    // ======================

    if (
      body.loadedAt &&
      Date.now() - body.loadedAt < 3000
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        error: "Suspicious submission"
      }));
    }

    // ======================
    // Validation
    // ======================

    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      res.writeHead(400, { "Content-Type": "application/json" });

      return res.end(JSON.stringify({
        error: "Invalid form data",
        details: parsed.error.issues
      }));
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      "cf-turnstile-response": turnstileToken
    } = parsed.data;

    // ======================
    // Verify Turnstile
    // ======================

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: turnstileToken
        })
      }
    );

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      res.writeHead(400, {
        "Content-Type": "application/json"
      });

      return res.end(JSON.stringify({
        error: "Turnstile verification failed"
      }));
    }

    // ======================
    // Sanitize Message
    // ======================

    const cleanMessage = sanitizeHtml(message, {
      allowedTags: [],
      allowedAttributes: {}
    });

    // ======================
    // SMTP Transport
    // ======================

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_APP_PASSWORD
      }
    });

    // ======================
    // Send Email
    // ======================

    await transporter.sendMail({
      from: `"Website Contact" <${ZOHO_EMAIL}>`,
      to: ZOHO_EMAIL,
      replyTo: email,
      subject: `[Website Contact] ${subject}`,
      text:
`Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

Message:
${cleanMessage}`,

      html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>

        <hr/>

        <p>${cleanMessage}</p>
      `
    });

    // ======================
    // Success Response
    // ======================

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    return res.end(JSON.stringify({
      success: true,
      message: "Email sent successfully"
    }));

  } catch (err) {

    console.error("CONTACT API ERROR:", err);

    res.writeHead(500, {
      "Content-Type": "application/json"
    });

    return res.end(JSON.stringify({
      error: "Internal server error"
    }));
  }
};