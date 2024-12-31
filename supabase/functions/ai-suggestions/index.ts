import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, query } = await req.json();
    
    let systemPrompt = '';
    if (type === 'search') {
      systemPrompt = 'You are a helpful assistant that suggests relevant subscription services based on user queries. Provide specific, real-world subscription services that match the user\'s needs.';
    } else if (type === 'chemistry') {
      systemPrompt = `You are an expert at combining subscription services to create powerful solutions. Your goal is to help users find the perfect combination of subscriptions that work well together to meet their specific needs. Consider:

1. Compatibility between services
2. Cost efficiency and potential bundle savings
3. Feature complementarity
4. Common use cases and workflows
5. Alternative combinations for different budgets

Always structure your responses with:
- Main recommendation
- Why these services work well together
- Estimated total cost
- Alternative combinations`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ 
      suggestion: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});