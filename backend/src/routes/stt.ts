/**
 * Speech-to-Text API Routes
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { transcribeAudio, isSTTConfigured } from '../services/stt';
import { isPremiumUser } from '../services/subscription';
import multer from 'multer';

const router = Router();

// Configure multer for audio file uploads (max 25MB - Whisper limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req, file, cb) => {
    // Accept common audio formats
    const allowedMimes = [
      'audio/webm',
      'audio/wav',
      'audio/mp3',
      'audio/mpeg',
      'audio/mp4',
      'audio/m4a',
      'audio/ogg',
      'audio/flac',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

/**
 * GET /stt/status - Check if STT is configured
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    configured: isSTTConfigured(),
    maxFileSizeMB: 25,
    supportedFormats: ['webm', 'wav', 'mp3', 'mp4', 'm4a', 'ogg', 'flac'],
  });
});

/**
 * POST /stt/transcribe - Transcribe audio to text
 */
router.post(
  '/transcribe',
  authenticate,
  upload.single('audio'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;

      // Check premium status (STT is a premium feature)
      const isPremium = await isPremiumUser(userId);
      if (!isPremium) {
        res.status(403).json({
          error: 'Voice input requires a premium subscription',
          code: 'PREMIUM_REQUIRED',
        });
        return;
      }

      if (!isSTTConfigured()) {
        res.status(503).json({ error: 'Speech-to-text service not configured' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'No audio file provided' });
        return;
      }

      const { language } = req.body;

      const result = await transcribeAudio(req.file.buffer, {
        language: language as string | undefined,
        filename: req.file.originalname || 'audio.webm',
      });

      res.json({
        text: result.text,
        language: result.language,
        duration: result.duration,
      });
    } catch (error: any) {
      console.error('Error transcribing audio:', error);

      if (error.message?.includes('Unsupported audio format')) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Failed to transcribe audio' });
    }
  }
);

export default router;
