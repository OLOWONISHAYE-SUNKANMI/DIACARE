import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MessageTemplate {
  id: string;
  type: string;
  content: string;
  reactions: string[];
  has_link: boolean;
  link_url?: string;
}

interface ScheduledMessage {
  id: string;
  template_id?: string;
  frequency: string;
  schedule_time?: string;
  schedule_day?: string;
  event_type?: string;
  is_active: boolean;
  last_sent_at?: string;
  next_send_at?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { action, payload } = await req.json();

    switch (action) {
      case 'check_due_messages':
        return await checkDueMessages(supabase);
      
      case 'send_scheduled_message':
        return await sendScheduledMessage(supabase, payload);
      
      case 'create_celebration':
        return await createCelebrationMessage(supabase, payload);
      
      case 'get_templates':
        return await getMessageTemplates(supabase);
        
      case 'get_scheduled':
        return await getScheduledMessages(supabase);
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    console.error('Auto-messaging error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function checkDueMessages(supabase: any) {
  try {
    const now = new Date().toISOString();
    
    // Get all scheduled messages that are due
    const { data: dueMessages, error } = await supabase
      .from('scheduled_messages')
      .select(`
        *,
        template:message_templates(*)
      `)
      .eq('is_active', true)
      .lte('next_send_at', now);

    if (error) {
      throw error;
    }

    const results = [];

    for (const message of dueMessages || []) {
      if (message.template) {
        // Send the message
        const { data: sentMessage, error: sendError } = await supabase
          .from('automated_messages')
          .insert({
            template_id: message.template_id,
            scheduled_message_id: message.id,
            message_type: message.template.type,
            content: message.template.content,
            reactions: message.template.reactions || [],
            metadata: {
              schedule_frequency: message.frequency,
              original_send_time: message.next_send_at
            }
          });

        if (sendError) {
          console.error('Error sending scheduled message:', sendError);
          continue;
        }

        results.push({
          message_id: message.id,
          content: message.template.content,
          type: message.template.type,
          sent: true
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        messages: results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking due messages:', error);
    throw error;
  }
}

async function sendScheduledMessage(supabase: any, payload: any) {
  try {
    const { template_id, message_type, content, reactions, user_id, metadata } = payload;

    const { data, error } = await supabase
      .from('automated_messages')
      .insert({
        template_id,
        message_type,
        content,
        reactions: reactions || [],
        user_id,
        metadata: metadata || {}
      });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending scheduled message:', error);
    throw error;
  }
}

async function createCelebrationMessage(supabase: any, payload: any) {
  try {
    const { user_id, user_name, celebration_type } = payload;

    const celebrationMessages = {
      one_year_dare: `🎉 Félicitations à ${user_name} pour 1 an avec DARE ! Un exemple pour nous tous 💪`,
      glucose_streak: `🌟 Bravo ${user_name} pour votre régularité dans le suivi glycémique ! 📊`,
      community_helper: `👏 Merci ${user_name} pour votre aide précieuse à la communauté ! 🤝`,
      milestone_reached: `🏆 ${user_name} a franchi une nouvelle étape importante ! Félicitations ! 🎯`
    };

    const content = celebrationMessages[celebration_type as keyof typeof celebrationMessages] || 
                   `🎉 Félicitations ${user_name} ! 🎊`;

    const { data, error } = await supabase
      .from('automated_messages')
      .insert({
        message_type: 'celebration',
        content,
        reactions: ['🎉', '👏', '❤️'],
        user_id,
        metadata: {
          celebration_type,
          user_name
        }
      });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating celebration message:', error);
    throw error;
  }
}

async function getMessageTemplates(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('is_active', true)
      .order('type', { ascending: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, templates: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

async function getScheduledMessages(supabase: any) {
  try {
    const { data, error } = await supabase
      .from('scheduled_messages')
      .select(`
        *,
        template:message_templates(*)
      `)
      .eq('is_active', true)
      .order('next_send_at', { ascending: true });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, scheduled: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    throw error;
  }
}