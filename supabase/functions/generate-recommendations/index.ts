import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    console.log(`Generating recommendations for user: ${userId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's current subscriptions
    const { data: userSubs } = await supabase
      .from('user_subscriptions')
      .select('service_category, service_name')
      .eq('user_id', userId);

    // Fetch user's feature usage
    const { data: featureUsage } = await supabase
      .from('feature_usage')
      .select('feature_name')
      .eq('user_id', userId);

    // Fetch all partner services
    const { data: partnerServices } = await supabase
      .from('partner_services')
      .select('*');

    if (!partnerServices) {
      throw new Error('No partner services found');
    }

    // Calculate recommendations
    const recommendations = partnerServices.map(service => {
      let score = 0;
      const reasons = [];

      // Category matching
      const userCategories = new Set(userSubs?.map(sub => sub.service_category) || []);
      if (service.category && userCategories.has(service.category)) {
        score += 30;
        reasons.push({ type: 'category_match', weight: 30 });
      }

      // Premium discount bonus
      if (service.premium_discount > 0) {
        score += service.premium_discount * 0.5;
        reasons.push({ type: 'premium_discount', weight: service.premium_discount * 0.5 });
      }

      // API integration bonus
      if (service.api_integration) {
        score += 20;
        reasons.push({ type: 'api_integration', weight: 20 });
      }

      // Popularity score
      if (service.popularity_score) {
        score += Math.min(service.popularity_score * 0.1, 20);
        reasons.push({ type: 'popularity', weight: Math.min(service.popularity_score * 0.1, 20) });
      }

      return {
        service_id: service.id,
        score: Math.min(score, 100), // Cap at 100
        reason: reasons
      };
    });

    // Store recommendations
    for (const rec of recommendations) {
      const { error: upsertError } = await supabase
        .from('subscription_recommendations')
        .upsert({
          user_id: userId,
          service_id: rec.service_id,
          score: rec.score,
          reason: rec.reason
        }, {
          onConflict: 'user_id,service_id'
        });

      if (upsertError) {
        console.error('Error upserting recommendation:', upsertError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Recommendations generated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});