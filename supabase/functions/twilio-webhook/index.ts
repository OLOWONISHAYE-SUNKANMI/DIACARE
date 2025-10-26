// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type GlobalEnv = {
  Deno?: { env?: { get(key: string): string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

const getEnv = (key: string) => {
  const g = globalThis as unknown as GlobalEnv;
  return g.Deno?.env?.get(key) ?? g.process?.env?.[key] ?? '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Hello from Functions!');

serve(async req => {
  // Log all incoming requests
  console.log('📨 Incoming Twilio webhook');

  try {
    // Parse Twilio's form data
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const messageSid = formData.get('MessageSid') as string;

    console.log('From:', from);
    console.log('Body:', body);
    console.log('MessageSid:', messageSid);

    // Parse format: "ABC123-1" or "ABC123-2"
    const match = body.trim().match(/^([A-Z0-9]{6})-([12])$/i);

    if (!match) {
      console.log('❌ Invalid format');
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Invalid format. Please reply with CODE-1 to approve or CODE-2 to deny.</Message></Response>',
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    const [, responseCode, action] = match;
    const response = parseInt(action);

    console.log('Response Code:', responseCode);
    console.log('Action:', response === 1 ? 'APPROVE' : 'DENY');

    // Process the response using the RPC function
    const { data, error } = await supabase.rpc('process_access_response', {
      p_response_code: responseCode.toUpperCase(),
      p_response: response,
    });

    if (error) {
      console.error('❌ RPC Error:', error);
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Message>Error processing your response. Please try again or contact support.</Message></Response>',
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    const result = data as {
      success: boolean;
      message?: string;
      error?: string;
    };

    console.log('✅ Result:', result);

    if (result.success) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${
          result.message || 'Thank you! Your response has been recorded.'
        }</Message></Response>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        }
      );
    }

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${
        result.error ||
        'Could not process your response. The code may be invalid or expired.'
      }</Message></Response>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Message>An error occurred. Please try again later.</Message></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
});
