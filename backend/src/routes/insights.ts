/**
 * Insights API Routes
 * User memory/insights management
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserInsights,
  archiveInsight,
  updateInsight,
  processConversationForInsights,
} from '../services/insightExtractor';
import { InsightCategory } from '@prisma/client';

const router = Router();

/**
 * GET /insights - Get user's insights (memory)
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { agentId, category, includeArchived } = req.query;

    const insights = await getUserInsights(userId, {
      agentId: agentId as string | undefined,
      category: category as InsightCategory | undefined,
      includeArchived: includeArchived === 'true',
    });

    res.json({ insights });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

/**
 * GET /insights/categories - Get insight categories
 */
router.get('/categories', (req: Request, res: Response) => {
  const categories = [
    { id: 'GOAL', name: 'Goals', description: 'Aspirations and objectives' },
    { id: 'CHALLENGE', name: 'Challenges', description: 'Obstacles and struggles' },
    { id: 'VALUE', name: 'Values', description: 'Core beliefs and priorities' },
    { id: 'PREFERENCE', name: 'Preferences', description: 'Coaching style preferences' },
    { id: 'ACHIEVEMENT', name: 'Achievements', description: 'Past successes' },
    { id: 'COMMITMENT', name: 'Commitments', description: 'Things committed to do' },
    { id: 'CONTEXT', name: 'Context', description: 'Life circumstances' },
    { id: 'RELATIONSHIP', name: 'Relationships', description: 'Important people' },
    { id: 'HABIT', name: 'Habits', description: 'Current routines' },
    { id: 'EMOTION', name: 'Emotions', description: 'Emotional patterns' },
  ];

  res.json({ categories });
});

/**
 * PATCH /insights/:id - Update an insight
 */
router.patch('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const insightId = req.params.id as string;
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'Content is required' });
      return;
    }

    const updated = await updateInsight(insightId, userId, content.trim());

    if (!updated) {
      res.status(404).json({ error: 'Insight not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating insight:', error);
    res.status(500).json({ error: 'Failed to update insight' });
  }
});

/**
 * DELETE /insights/:id - Archive an insight
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const insightId = req.params.id as string;

    const archived = await archiveInsight(insightId, userId);

    if (!archived) {
      res.status(404).json({ error: 'Insight not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error archiving insight:', error);
    res.status(500).json({ error: 'Failed to archive insight' });
  }
});

/**
 * POST /insights/extract - Manually trigger insight extraction for a conversation
 */
router.post('/extract', authenticate, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;

    if (!conversationId) {
      res.status(400).json({ error: 'conversationId is required' });
      return;
    }

    const result = await processConversationForInsights(conversationId);

    res.json({
      success: true,
      extracted: result.extracted,
      saved: result.saved,
    });
  } catch (error) {
    console.error('Error extracting insights:', error);
    res.status(500).json({ error: 'Failed to extract insights' });
  }
});

export default router;
