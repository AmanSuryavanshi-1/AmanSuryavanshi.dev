import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { UserConfirmationTemplate, AdminNotificationTemplate } from '@/lib/email-templates';

// Schema for validation
const contactSchema = z.object({
  from_name: z.string().min(2, 'Name must be at least 2 characters'),
  reply_to: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message cannot be empty'),
});

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const WINDOW_SIZE = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > WINDOW_SIZE) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Key' },
        { status: 500 }
      );
    }
    const resend = new Resend(apiKey);

    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Validation & Sanitization
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { from_name, reply_to, message } = result.data;

    // 3. Send Emails
    // Admin Notification
    const adminEmail = await resend.emails.send({
      from: 'Portfolio Contact <noreply@amansuryavanshi.me>',
      to: 'amansurya.work@gmail.com',
      subject: `New Contact Form Submission from ${from_name}`,
      html: AdminNotificationTemplate(from_name, reply_to, message),
      replyTo: reply_to,
    });

    if (adminEmail.error) {
      console.error('Admin email error:', adminEmail.error);
      return NextResponse.json({ error: `Failed to send email: ${adminEmail.error.message}` }, { status: 500 });
    }

    // User Confirmation
    const userEmail = await resend.emails.send({
      from: 'Aman Suryavanshi <noreply@amansuryavanshi.me>',
      to: reply_to,
      subject: 'Thank you for reaching out!',
      html: UserConfirmationTemplate(from_name, message),
    });

    if (userEmail.error) {
      console.error('User email error:', userEmail.error);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
