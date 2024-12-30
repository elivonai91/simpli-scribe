import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { serviceName } = await req.json()

    // Generate a logo using DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a modern, minimalist logo for ${serviceName}. The logo should be professional, memorable, and work well at different sizes. Use a clean design with simple shapes and limited colors. The logo should reflect the brand's identity but be abstract enough to be unique.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      }),
    })

    const data = await response.json()
    
    if (!data.data?.[0]?.url) {
      throw new Error('No image URL received from DALL-E')
    }

    // Download the image
    const imageResponse = await fetch(data.data[0].url)
    const imageBlob = await imageResponse.blob()

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileName = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('subscription_logos')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('subscription_logos')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({
        logo_path: publicUrl
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})