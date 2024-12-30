import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { serviceName } = await req.json()
    console.log('Generating logo for service:', serviceName)

    // Generate a logo using DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Create a simple, minimalist, professional logo for ${serviceName}. The logo should be clean, modern, and work well at different sizes. Use a simple color palette and avoid text.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DALL-E API error:', error)
      throw new Error(`DALL-E API error: ${error}`)
    }

    const data = await response.json()
    console.log('DALL-E response:', JSON.stringify(data))

    if (!data.data?.[0]?.url) {
      console.error('No image URL in DALL-E response:', data)
      throw new Error('No image URL received from DALL-E')
    }

    // Download the image
    const imageResponse = await fetch(data.data[0].url)
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image')
    }
    const imageBlob = await imageResponse.blob()

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileName = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
    console.log('Uploading to storage with filename:', fileName)

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('subscription_logos')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      throw uploadError
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('subscription_logos')
      .getPublicUrl(fileName)

    console.log('Successfully generated and uploaded logo:', publicUrl)

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
    console.error('Error in generate-logo function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})