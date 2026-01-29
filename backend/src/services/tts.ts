/**
 * Text-to-Speech Service using ElevenLabs API
 *
 * ElevenLabs Pricing (Creator tier):
 * - ~$0.30 per 1,000 characters
 * - Voices: Various premium voices available
 * - Models: eleven_multilingual_v2 (best quality), eleven_turbo_v2 (faster)
 */

// Default voice IDs from ElevenLabs
export const ELEVENLABS_VOICES = {
  rachel: {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    description: 'Calm, warm female voice',
  },
  domi: {
    id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    description: 'Strong, confident female voice',
  },
  bella: {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'Soft, friendly female voice',
  },
  antoni: {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    description: 'Well-rounded male voice',
  },
  josh: {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    description: 'Deep, resonant male voice',
  },
  arnold: {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Crisp, clear male voice',
  },
  adam: {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Deep, authoritative male voice',
  },
  sam: {
    id: 'yoZ06aMxZJJ28mfd3POQ',
    name: 'Sam',
    description: 'Raspy, dynamic male voice',
  },
} as const;

export type VoiceId = keyof typeof ELEVENLABS_VOICES;

// Default voice for coaches
export const DEFAULT_VOICE_ID = 'rachel';

// Model options
export const ELEVENLABS_MODELS = {
  multilingual_v2: 'eleven_multilingual_v2', // Best quality
  turbo_v2: 'eleven_turbo_v2', // Faster, lower latency
};

interface TTSOptions {
  voiceId?: string;
  model?: string;
  stability?: number; // 0-1, lower = more expressive
  similarityBoost?: number; // 0-1, higher = closer to original voice
}

/**
 * Check if ElevenLabs is configured
 */
export function isTTSConfigured(): boolean {
  return !!process.env.ELEVENLABS_API_KEY;
}

/**
 * Synthesize speech from text using ElevenLabs API
 * Returns audio as a Buffer (mp3 format)
 */
export async function synthesizeSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const voiceId = options.voiceId || ELEVENLABS_VOICES[DEFAULT_VOICE_ID].id;
  const model = options.model || ELEVENLABS_MODELS.turbo_v2;
  const stability = options.stability ?? 0.5;
  const similarityBoost = options.similarityBoost ?? 0.8;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ElevenLabs error:', errorText);
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Stream speech synthesis (for lower latency)
 * Returns a readable stream of audio chunks
 */
export async function synthesizeSpeechStream(
  text: string,
  options: TTSOptions = {}
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const voiceId = options.voiceId || ELEVENLABS_VOICES[DEFAULT_VOICE_ID].id;
  const model = options.model || ELEVENLABS_MODELS.turbo_v2;
  const stability = options.stability ?? 0.5;
  const similarityBoost = options.similarityBoost ?? 0.8;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ElevenLabs stream error:', errorText);
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body from ElevenLabs');
  }

  return response.body;
}

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices(): Promise<Array<{
  id: string;
  name: string;
  description?: string;
  category?: string;
}>> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    // Return built-in voices if API key not configured
    return Object.values(ELEVENLABS_VOICES).map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
    }));
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    const data = (await response.json()) as { voices: any[] };
    return data.voices.map((v: any) => ({
      id: v.voice_id,
      name: v.name,
      description: v.labels?.description || v.description,
      category: v.category,
    }));
  } catch (error) {
    console.error('Error fetching voices:', error);
    // Fallback to built-in voices
    return Object.values(ELEVENLABS_VOICES).map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
    }));
  }
}

/**
 * Estimate character count for billing purposes
 */
export function estimateCharacterCount(text: string): number {
  return text.length;
}

/**
 * Estimate cost in USD (approximate)
 */
export function estimateCost(text: string): number {
  const chars = estimateCharacterCount(text);
  // ~$0.30 per 1,000 characters at Creator tier
  return (chars / 1000) * 0.3;
}
