/**
 * Speech-to-Text Service using OpenAI Whisper API
 *
 * Whisper Pricing:
 * - $0.006 per minute of audio
 */

import OpenAI from 'openai';
import { Readable } from 'stream';

// Initialize client (lazy loaded)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

/**
 * Check if STT is configured
 */
export function isSTTConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

/**
 * Transcribe audio using OpenAI Whisper
 * Accepts audio buffer in various formats (mp3, wav, webm, etc.)
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  options: {
    language?: string; // ISO-639-1 code (e.g., 'en', 'es')
    prompt?: string; // Optional prompt to guide transcription
    filename?: string; // Helps Whisper understand the format
  } = {}
): Promise<TranscriptionResult> {
  const client = getOpenAIClient();

  // Create a File-like object from the buffer using Uint8Array
  const uint8Array = new Uint8Array(audioBuffer);
  const file = new File(
    [uint8Array],
    options.filename || 'audio.webm',
    { type: 'audio/webm' }
  );

  const response = await client.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: options.language,
    prompt: options.prompt,
    response_format: 'verbose_json',
  });

  return {
    text: response.text,
    language: response.language,
    duration: response.duration,
  };
}

/**
 * Transcribe audio from a readable stream
 */
export async function transcribeStream(
  stream: Readable,
  options: {
    language?: string;
    prompt?: string;
    filename?: string;
  } = {}
): Promise<TranscriptionResult> {
  // Collect stream into buffer
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  const buffer = Buffer.concat(chunks);

  return transcribeAudio(buffer, options);
}

/**
 * Estimate transcription cost in USD
 */
export function estimateCost(durationSeconds: number): number {
  const durationMinutes = durationSeconds / 60;
  // $0.006 per minute
  return durationMinutes * 0.006;
}
