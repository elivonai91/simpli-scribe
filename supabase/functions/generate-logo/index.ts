import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { serviceName } = await req.json();
    console.log('Generating logo for:', serviceName);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if logo already exists
    const { data: existingLogo } = await supabase
      .from('subscription_logos')
      .select('logo_path')
      .eq('service_name', serviceName)
      .single();

    if (existingLogo) {
      console.log('Logo already exists:', existingLogo);
      return new Response(
        JSON.stringify({ logo_path: existingLogo.logo_path }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate logo using OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a modern, minimalist app icon for ${serviceName}. The icon should be simple, memorable, and suitable for a subscription service. Use a clean design with a single primary color. The icon should work well at small sizes and be instantly recognizable.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      }),
    });

    const imageData = await response.json();
    console.log('OpenAI response:', imageData);

    if (!imageData.data?.[0]?.url) {
      throw new Error('Failed to generate image');
    }

    // Download the image
    const imageResponse = await fetch(imageData.data[0].url);
    const imageBlob = await imageResponse.blob();

    // Upload to Supabase Storage
    const filePath = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('subscription_logos')
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('subscription_logos')
      .getPublicUrl(filePath);

    // Save to database
    const { error: dbError } = await supabase
      .from('subscription_logos')
      .insert({
        service_name: serviceName,
        logo_path: publicUrl
      });

    if (dbError) {
      throw dbError;
    }

    console.log('Logo generated and stored successfully:', publicUrl);

    return new Response(
      JSON.stringify({ logo_path: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-logo function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});