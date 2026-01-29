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

  // Determine the mime type from filename
  // Note: Whisper supports mp3, mp4, mpeg, mpga, m4a, wav, webm
  const filename = options.filename || 'audio.m4a';
  let mimeType = 'audio/mp4'; // Default to mp4 which is widely supported
  if (filename.endsWith('.mp3')) mimeType = 'audio/mpeg';
  else if (filename.endsWith('.wav')) mimeType = 'audio/wav';
  else if (filename.endsWith('.m4a')) mimeType = 'audio/mp4';
  else if (filename.endsWith('.mp4')) mimeType = 'audio/mp4';
  else if (filename.endsWith('.ogg')) mimeType = 'audio/ogg';
  else if (filename.endsWith('.flac')) mimeType = 'audio/flac';
  else if (filename.endsWith('.webm')) mimeType = 'audio/webm';
  else if (filename.endsWith('.caf')) mimeType = 'audio/mp4'; // iOS CAF - treat as mp4
  else if (filename.endsWith('.3gp')) mimeType = 'audio/mp4'; // Android 3gp - treat as mp4
  else if (filename.endsWith('.aac')) mimeType = 'audio/mp4'; // AAC - treat as mp4

  // Use toFile helper from OpenAI SDK for proper Node.js compatibility
  const file = await OpenAI.toFile(audioBuffer, filename, { type: mimeType });

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
