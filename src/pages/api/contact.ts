import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    // Honeypot check
    if (data.get('website')) {
      return new Response(JSON.stringify({ message: 'OK' }), { status: 200 });
    }

    const naam = data.get('naam')?.toString().trim();
    const telefoon = data.get('telefoon')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const locatie = data.get('locatie')?.toString().trim();
    const type = data.get('type')?.toString().trim();
    const beschrijving = data.get('beschrijving')?.toString().trim();

    if (!naam || !telefoon || !locatie || !type) {
      return new Response(
        JSON.stringify({ error: 'Vul alle verplichte velden in.' }),
        { status: 400 }
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Huisleegmakers Website <noreply@huisleegmakers.gent>',
        to: ['info@huisleegmakers.gent'],
        subject: `Nieuwe offerte aanvraag: ${type} - ${naam}`,
        html: htmlBody,
        reply_to: email || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Er ging iets mis bij het verzenden.' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Uw aanvraag is succesvol verzonden!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
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
