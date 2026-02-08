import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_TYPES = ['woningontruiming', 'overlijden', 'bedrijfsontruiming', 'spoedontruiming', 'anders'];
const MAX_FIELD_LENGTH = 500;
const MAX_NAME_LENGTH = 100;

export const POST: APIRoute = async ({ request }) => {
  try {
    // CSRF: check Origin/Referer header
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    const allowedOrigins = ['https://huisleegmakers.gent', 'https://huisleegmakers-kohl.vercel.app', 'http://localhost:4321', 'http://localhost:4322'];
    const isAllowed = allowedOrigins.some(o => origin.startsWith(o));
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Ongeldig verzoek.' }), { status: 403 });
    }

    const data = await request.formData();

    // Honeypot check
    if (data.get('website')) {
      return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
    }

    const naam = data.get('naam')?.toString().trim().slice(0, MAX_NAME_LENGTH);
    const telefoon = data.get('telefoon')?.toString().trim().slice(0, 30);
    const email = data.get('email')?.toString().trim().slice(0, 254);
    const locatie = data.get('locatie')?.toString().trim().slice(0, MAX_NAME_LENGTH);
    const type = data.get('type')?.toString().trim();
    const beschrijving = data.get('beschrijving')?.toString().trim().slice(0, MAX_FIELD_LENGTH);

    if (!naam || !telefoon || !locatie || !type) {
      return new Response(
        JSON.stringify({ error: 'Vul alle verplichte velden in.' }),
        { status: 400 }
      );
    }

    // Validate type against whitelist
    if (!ALLOWED_TYPES.includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Ongeldig type ontruiming.' }),
        { status: 400 }
      );
    }

    // Validate phone format (Belgian/international numbers)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{6,20}$/;
    if (!phoneRegex.test(telefoon)) {
      return new Response(
        JSON.stringify({ error: 'Ongeldig telefoonnummer.' }),
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Ongeldig e-mailadres.' }),
          { status: 400 }
        );
      }
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('Email service not configured');
      return new Response(
        JSON.stringify({ error: 'Server configuratiefout.' }),
        { status: 500 }
      );
    }

    const htmlBody = `
      <h2>Nieuwe offerte aanvraag via huisleegmakers.gent</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Naam</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(naam)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Telefoon</td><td style="padding:8px;border:1px solid #ddd;"><a href="tel:${escapeHtml(telefoon)}">${escapeHtml(telefoon)}</a></td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">E-mail</td><td style="padding:8px;border:1px solid #ddd;">${email ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>` : '-'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Locatie</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(locatie)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Type ontruiming</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(type)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Beschrijving</td><td style="padding:8px;border:1px solid #ddd;">${beschrijving ? escapeHtml(beschrijving) : '-'}</td></tr>
      </table>
    `;

    // Sanitize email headers to prevent injection
    const safeNaam = sanitizeHeader(naam);
    const safeType = sanitizeHeader(type);
    const safeReplyTo = email ? sanitizeHeader(email) : undefined;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Huisleegmakers Website <noreply@huisleegmakers.gent>',
        to: ['info@huisleegmakers.gent'],
        subject: `Nieuwe offerte aanvraag: ${safeType} - ${safeNaam}`,
        html: htmlBody,
        reply_to: safeReplyTo,
      }),
    });

    if (!response.ok) {
      console.error('Email API error occurred');
      return new Response(
        JSON.stringify({ error: 'Er ging iets mis bij het verzenden.' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Uw aanvraag is succesvol verzonden!' }),
      { status: 200 }
    );
  } catch {
    console.error('Contact form error occurred');
    return new Response(
      JSON.stringify({ error: 'Er ging iets mis. Probeer het opnieuw.' }),
      { status: 500 }
    );
  }
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeHeader(str: string): string {
  // Remove newlines and carriage returns to prevent header injection
  return str.replace(/[\r\n\t]/g, '').trim();
}
