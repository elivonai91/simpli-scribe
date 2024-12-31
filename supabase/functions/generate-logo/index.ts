import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { serviceName } = await req.json()
    console.log('Fetching logo for service:', serviceName)

    // Use Perplexity to search for the official logo
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that finds official company logos. Return ONLY the direct URL to the highest quality, official logo image you can find. The URL must end in .png, .jpg, or .jpeg. Do not include any other text or explanation in your response.'
          },
          {
            role: 'user',
            content: `Find the official logo URL for ${serviceName}. The URL must be a direct link to the image file.`
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
        return_images: false
      }),
    })

    if (!perplexityResponse.ok) {
      const error = await perplexityResponse.text()
      console.error('Perplexity API error:', error)
      throw new Error(`Perplexity API error: ${error}`)
    }

    const data = await perplexityResponse.json()
    const logoUrl = data.choices[0].message.content.trim()
    console.log('Found logo URL:', logoUrl)

    // Download the image
    const imageResponse = await fetch(logoUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download logo image')
    }
    const imageBlob = await imageResponse.blob()

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileName = `${serviceName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${logoUrl.split('.').pop()}`
    console.log('Uploading to storage with filename:', fileName)

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('subscription_logos')
      .upload(fileName, imageBlob, {
        contentType: imageResponse.headers.get('content-type') || 'image/png',
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

    console.log('Successfully fetched and uploaded logo:', publicUrl)

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