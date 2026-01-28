import { Router, Request, Response } from 'express';
import { prisma } from '../services/database';
import { authenticate } from '../middleware/auth';
import { randomUUID } from 'crypto';
import {
  createAssessmentConfigSchema,
  assessmentConfigSchema,
  assessmentResponseSchema,
  type AssessmentConfig,
} from '../validation/assessments';

const router = Router();

/**
 * GET /agents/:id/assessments - Get agent's assessment configs
 */
router.get('/agents/:id/assessments', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        assessmentConfigs: true,
      },
    });

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    // Parse assessment configs from JSON
    const assessments = (agent.assessmentConfigs as AssessmentConfig[]) || [];

    res.json({ assessments });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

/**
 * POST /agents/:id/assessments - Add assessment config (creator only)
 */
router.post('/agents/:id/assessments', authenticate, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const userId = req.userId!;

    // Verify agent exists and user is creator
    const agent = await prisma.agent.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
        assessmentConfigs: true,
      },
    });

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    if (agent.creatorId !== userId) {
      res.status(403).json({ error: 'Only the creator can add assessments' });
      return;
    }

    // Validate input
    const validationResult = createAssessmentConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid assessment config',
        details: validationResult.error.issues,
      });
      return;
    }

    const input = validationResult.data;

    // Generate IDs for assessment and questions if not provided
    const newAssessment: AssessmentConfig = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      triggerType: input.triggerType,
      questions: input.questions.map((q) => ({
        ...q,
        id: q.id || randomUUID(),
        required: q.required ?? true,
      })),
    };

    // Add to existing assessments
    const existingAssessments = (agent.assessmentConfigs as AssessmentConfig[]) || [];
    const updatedAssessments = [...existingAssessments, newAssessment];

    await prisma.agent.update({
      where: { id },
      data: {
        assessmentConfigs: updatedAssessments as any,
      },
    });

    res.status(201).json({ assessment: newAssessment });
  } catch (error) {
    console.error('Error adding assessment:', error);
    res.status(500).json({ error: 'Failed to add assessment' });
  }
});

/**
 * PUT /agents/:id/assessments/:assessmentId - Update assessment config
 */
router.put(
  '/agents/:id/assessments/:assessmentId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const assessmentId = String(req.params.assessmentId);
      const userId = req.userId!;

      // Verify agent exists and user is creator
      const agent = await prisma.agent.findUnique({
        where: { id },
        select: {
          id: true,
          creatorId: true,
          assessmentConfigs: true,
        },
      });

      if (!agent) {
        res.status(404).json({ error: 'Agent not found' });
        return;
      }

      if (agent.creatorId !== userId) {
        res.status(403).json({ error: 'Only the creator can update assessments' });
        return;
      }

      // Validate input
      const validationResult = assessmentConfigSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Invalid assessment config',
          details: validationResult.error.issues,
        });
        return;
      }

      const updatedAssessment = validationResult.data;

      // Ensure the ID matches
      if (updatedAssessment.id !== assessmentId) {
        res.status(400).json({ error: 'Assessment ID mismatch' });
        return;
      }

      // Update in existing assessments
      const existingAssessments = (agent.assessmentConfigs as AssessmentConfig[]) || [];
      const index = existingAssessments.findIndex((a) => a.id === assessmentId);

      if (index === -1) {
        res.status(404).json({ error: 'Assessment not found' });
        return;
      }

      existingAssessments[index] = updatedAssessment;

      await prisma.agent.update({
        where: { id },
        data: {
          assessmentConfigs: existingAssessments as any,
        },
      });

      res.json({ assessment: updatedAssessment });
    } catch (error) {
      console.error('Error updating assessment:', error);
      res.status(500).json({ error: 'Failed to update assessment' });
    }
  }
);

/**
 * DELETE /agents/:id/assessments/:assessmentId - Delete assessment config
 */
router.delete(
  '/agents/:id/assessments/:assessmentId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const assessmentId = String(req.params.assessmentId);
      const userId = req.userId!;

      // Verify agent exists and user is creator
      const agent = await prisma.agent.findUnique({
        where: { id },
        select: {
          id: true,
          creatorId: true,
          assessmentConfigs: true,
        },
      });

      if (!agent) {
        res.status(404).json({ error: 'Agent not found' });
        return;
      }

      if (agent.creatorId !== userId) {
        res.status(403).json({ error: 'Only the creator can delete assessments' });
        return;
      }

      // Remove from existing assessments
      const existingAssessments = (agent.assessmentConfigs as AssessmentConfig[]) || [];
      const index = existingAssessments.findIndex((a) => a.id === assessmentId);

      if (index === -1) {
        res.status(404).json({ error: 'Assessment not found' });
        return;
      }

      existingAssessments.splice(index, 1);

      await prisma.agent.update({
        where: { id },
        data: {
          assessmentConfigs: existingAssessments as any,
        },
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting assessment:', error);
      res.status(500).json({ error: 'Failed to delete assessment' });
    }
  }
);

/**
 * POST /assessments/:assessmentId/responses - Submit user responses
 */
router.post(
  '/assessments/:assessmentId/responses',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const assessmentId = String(req.params.assessmentId);
      const userId = req.userId!;
      const { agentId, conversationId } = req.body;

      if (!agentId) {
        res.status(400).json({ error: 'agentId is required' });
        return;
      }

      const agentIdStr = String(agentId);

      // Verify agent exists and has this assessment
      const agent = await prisma.agent.findUnique({
        where: { id: agentIdStr },
        select: {
          id: true,
          assessmentConfigs: true,
        },
      });

      if (!agent) {
        res.status(404).json({ error: 'Agent not found' });
        return;
      }

      const assessments = (agent.assessmentConfigs as AssessmentConfig[]) || [];
      const assessment = assessments.find((a) => a.id === assessmentId);

      if (!assessment) {
        res.status(404).json({ error: 'Assessment not found' });
        return;
      }

      // Validate answers
      const validationResult = assessmentResponseSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Invalid response data',
          details: validationResult.error.issues,
        });
        return;
      }

      const { answers } = validationResult.data;

      // Check required questions are answered
      for (const question of assessment.questions) {
        if (question.required && answers[question.id] === undefined) {
          res.status(400).json({
            error: `Missing required answer for question: ${question.text}`,
          });
          return;
        }
      }

      // Validate conversationId if provided
      if (conversationId) {
        const conversation = await prisma.conversation.findUnique({
          where: { id: String(conversationId) },
        });
        if (!conversation) {
          res.status(404).json({ error: 'Conversation not found' });
          return;
        }
      }

      // Create response
      const response = await prisma.assessmentResponse.create({
        data: {
          userId,
          agentId: agentIdStr,
          conversationId: conversationId ? String(conversationId) : null,
          assessmentId,
          answers: answers as any,
        },
      });

      res.status(201).json({ response });
    } catch (error) {
      console.error('Error submitting assessment response:', error);
      res.status(500).json({ error: 'Failed to submit response' });
    }
  }
);

/**
 * GET /users/me/assessment-responses - Get user's assessment history
 */
router.get(
  '/users/me/assessment-responses',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const agentIdParam = req.query.agentId;
      const limitParam = req.query.limit;

      const where: any = { userId };
      if (agentIdParam && typeof agentIdParam === 'string') {
        where.agentId = agentIdParam;
      }

      const responses = await prisma.assessmentResponse.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              assessmentConfigs: true,
            },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: limitParam ? Number(limitParam) : 50,
      });

      // Enrich responses with assessment config details
      const enrichedResponses = responses.map((response) => {
        const assessments = (response.agent.assessmentConfigs as AssessmentConfig[]) || [];
        const assessment = assessments.find((a) => a.id === response.assessmentId);

        return {
          id: response.id,
          assessmentId: response.assessmentId,
          assessmentName: assessment?.name || 'Unknown Assessment',
          agentId: response.agentId,
          agentName: response.agent.name,
          agentAvatarUrl: response.agent.avatarUrl,
          conversationId: response.conversationId,
          answers: response.answers,
          completedAt: response.completedAt,
        };
      });

      res.json({ responses: enrichedResponses });
    } catch (error) {
      console.error('Error fetching assessment responses:', error);
      res.status(500).json({ error: 'Failed to fetch responses' });
    }
  }
);

export default router;
