import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [{
        role: 'user',
        content: 'Generate one morally ambiguous empathy scenario in exactly 2 sentences. Make it spicy and challenging (e.g., "Your friend is failing, but their failure makes you look better. What do you say?"). Return only the scenario text.'
      }],
      temperature: 0.9,
      max_tokens: 50,
    });

    const prompt = completion.choices[0].message.content?.trim() || 'How might you show empathy in a challenging situation today?';
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Prompt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}