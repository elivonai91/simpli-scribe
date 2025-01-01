import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId } = await req.json();
    console.log(`Starting subscription detection for email: ${email}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create detection log entry
    const { data: logEntry, error: logError } = await supabase
      .from('subscription_detection_logs')
      .insert({
        user_id: userId,
        email: email,
        status: 'processing'
      })
      .select()
      .single();

    if (logError) throw logError;

    // Simulate subscription detection (replace with actual AI implementation)
    const commonSubscriptions = [
      {
        name: 'Netflix',
        cost: 15.99,
        billingCycle: 'monthly',
        category: 'Entertainment'
      },
      {
        name: 'Spotify',
        cost: 9.99,
        billingCycle: 'monthly',
        category: 'Music'
      }
    ];

    // Update log with detected subscriptions
    const { error: updateError } = await supabase
      .from('subscription_detection_logs')
      .update({
        detected_subscriptions: commonSubscriptions,
        status: 'completed'
      })
      .eq('id', logEntry.id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        subscriptions: commonSubscriptions,
        message: 'Subscriptions detected successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in detect-subscriptions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});