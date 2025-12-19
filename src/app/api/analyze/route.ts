import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { scenario, userResponse, apiKey, provider = 'openrouter' } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API_KEY_MISSING" }, { status: 400 });
    }

    // Define free models from different providers
    const FREE_MODELS = {
      openrouter: [
        "allenai/olmo-3.1-32b-think:free",
        "xiaomi/mimo-v2-flash:free",
        "nvidia/nemotron-3-nano-30b-a3b:free",
        "meta-llama/llama-3.2-3b-instruct:free"
      ],
      together: [
        "meta-llama/Llama-3.3-70B-Instruct-Turbo"
      ],
      groq: [
        "llama3-8b-8192",
        "llama3-70b-8192",
        "mixtral-8x7b-32768"
      ]
    };

    const model = "allenai/olmo-3.1-32b-think:free";
    
    if (!userResponse) return NextResponse.json({ error: "No response provided" }, { status: 400 });

    const systemPrompt = `
      You are a ruthless psychological mirror. Do not teach. Do not coddle. Output a JSON with scores (0-100) for Empathy, Honesty, Wisdom, and a 1-sentence Brutal Verdict.
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "empathy": (0-100 score),
        "honesty": (0-100 score),
        "wisdom": (0-100 score),
        "verdict": "A single, sharp, brutal sentence analyzing their character."
      }
    `;

    let lastError = null;

    // Try models from the specified provider first
    if (FREE_MODELS[provider as keyof typeof FREE_MODELS]) {
      for (const model of FREE_MODELS[provider as keyof typeof FREE_MODELS]) {
        try {
          const response = await makeAPIRequest(provider, apiKey, model, systemPrompt, `Scenario: ${scenario}\n\nUser Response: ${userResponse}`);
          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              const content = JSON.parse(data.choices[0].message.content);
              return NextResponse.json(content);
            }
          }
          // If we get here, the model failed, try next one
          lastError = `Model ${model} failed`;
        } catch (error) {
          lastError = error;
          continue; // Try next model
        }
      }
    }

    // If specified provider fails, try OpenRouter models as fallback
    if (provider !== 'openrouter') {
      for (const model of FREE_MODELS.openrouter) {
        try {
          const response = await makeAPIRequest('openrouter', apiKey, model, systemPrompt, `Scenario: ${scenario}\n\nUser Response: ${userResponse}`);
          if (response.ok) {
            const data = await response.json();
            if (data.choices?.[0]?.message?.content) {
              const content = JSON.parse(data.choices[0].message.content);
              return NextResponse.json(content);
            }
          }
        } catch (error) {
          continue;
        }
      }
    }

    return NextResponse.json({
      empathy: 0, honesty: 0, wisdom: 0,
      verdict: "Error: All models failed. Please check your API key or try again later."
    });

  } catch (error) {
    return NextResponse.json({ error: "Analysis Failed" }, { status: 500 });
  }
}

async function makeAPIRequest(provider: string, apiKey: string, model: string, systemPrompt: string, userContent: string) {
  let url = '';
  let headers = {};
  let body = {};

  switch (provider) {
    case 'openrouter':
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
      };
      body = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        response_format: { type: "json_object" }
      };
      break;

    case 'together':
      url = "https://api.together.xyz/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      body = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        response_format: { type: "json_object" }
      };
      break;

    case 'groq':
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      body = {
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        response_format: { type: "json_object" }
      };
      break;

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
}