/**
 * Insight Extraction Service
 * Extracts meaningful insights from conversations using LLM analysis
 */

import { prisma } from './database';
import OpenAI from 'openai';
import { InsightCategory } from '@prisma/client';

// Initialize OpenAI client (using OpenAI for JSON mode reliability)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Category descriptions for the LLM
const CATEGORY_DESCRIPTIONS: Record<InsightCategory, string> = {
  GOAL: 'Goals, aspirations, things they want to achieve',
  CHALLENGE: 'Struggles, obstacles, pain points they face',
  VALUE: 'Core values, beliefs, what matters to them',
  PREFERENCE: 'How they prefer to be coached, communication style',
  ACHIEVEMENT: 'Past accomplishments, successes they mentioned',
  COMMITMENT: 'Specific things they committed to do',
  CONTEXT: 'Life circumstances, background, situation info',
  RELATIONSHIP: 'Important people in their life (partner, boss, family)',
  HABIT: 'Current habits, routines, behaviors',
  EMOTION: 'Recurring emotional patterns, feelings they express',
};

interface ExtractedInsight {
  category: InsightCategory;
  content: string;
  confidence: number;
  extractedFrom: string;
}

/**
 * Extract insights from a conversation's messages
 */
export async function extractInsightsFromConversation(
  conversationId: string,
  userId: string,
  agentId: string
): Promise<ExtractedInsight[]> {
  // Get conversation messages
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true, createdAt: true },
  });

  if (messages.length < 2) {
    return []; // Need at least a back-and-forth
  }

  // Get existing insights to avoid duplicates
  const existingInsights = await prisma.userInsight.findMany({
    where: { userId, isArchived: false },
    select: { content: true, category: true },
  });

  const existingInsightsSummary = existingInsights
    .map((i) => `[${i.category}] ${i.content}`)
    .join('\n');

  // Format conversation for analysis
  const conversationText = messages
    .map((m) => `${m.role === 'USER' ? 'User' : 'Coach'}: ${m.content}`)
    .join('\n\n');

  // Build prompt for extraction
  const systemPrompt = `You are an insight extraction system for a coaching app. Your job is to identify meaningful, long-term insights about the user from their conversation with their coach.

## Categories to extract:
${Object.entries(CATEGORY_DESCRIPTIONS)
  .map(([cat, desc]) => `- ${cat}: ${desc}`)
  .join('\n')}

## Guidelines:
1. Only extract CONCRETE, SPECIFIC insights - not vague observations
2. Focus on facts about the user, not the conversation itself
3. Each insight should be a complete, standalone statement
4. Confidence should be 0.6-1.0 based on how explicitly stated vs inferred
5. Don't extract insights that are too similar to existing ones
6. Prioritize actionable or relationship-building insights
7. Keep insights concise (under 100 chars ideally)

## Existing insights (avoid duplicates):
${existingInsightsSummary || 'None yet'}

## Response format (JSON):
{
  "insights": [
    {
      "category": "GOAL",
      "content": "Wants to run a marathon by end of year",
      "confidence": 0.9,
      "extractedFrom": "Brief quote or context"
    }
  ]
}

Return an empty array if no clear new insights can be extracted.`;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-5.2', // Fast and cheap for extraction
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Analyze this conversation and extract insights about the user:\n\n${conversationText}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    const parsed = JSON.parse(content) as { insights: ExtractedInsight[] };
    return parsed.insights || [];
  } catch (error) {
    console.error('Error extracting insights:', error);
    return [];
  }
}

/**
 * Save extracted insights to the database
 */
export async function saveInsights(
  userId: string,
  agentId: string | null,
  conversationId: string | null,
  insights: ExtractedInsight[]
): Promise<number> {
  if (insights.length === 0) return 0;

  let savedCount = 0;

  for (const insight of insights) {
    try {
      // Check for near-duplicates using simple string matching
      const existing = await prisma.userInsight.findFirst({
        where: {
          userId,
          content: {
            contains: insight.content.substring(0, 30),
            mode: 'insensitive',
          },
          isArchived: false,
        },
      });

      if (existing) continue;

      await prisma.userInsight.create({
        data: {
          userId,
          agentId,
          conversationId,
          category: insight.category,
          content: insight.content,
          confidence: insight.confidence,
          extractedFrom: insight.extractedFrom,
        },
      });

      savedCount++;
    } catch (error) {
      console.error('Error saving insight:', error);
    }
  }

  return savedCount;
}

/**
 * Process a conversation for insights (call after conversation ends or periodically)
 */
export async function processConversationForInsights(
  conversationId: string
): Promise<{ extracted: number; saved: number }> {
  // Get conversation details
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userId: true, agentId: true },
  });

  if (!conversation) {
    return { extracted: 0, saved: 0 };
  }

  const insights = await extractInsightsFromConversation(
    conversationId,
    conversation.userId,
    conversation.agentId
  );

  const saved = await saveInsights(
    conversation.userId,
    conversation.agentId,
    conversationId,
    insights
  );

  return { extracted: insights.length, saved };
}

/**
 * Get user insights for prompt injection
 */
export async function getInsightsForPrompt(
  userId: string,
  agentId?: string,
  limit = 20
): Promise<string> {
  // Get global insights and agent-specific insights
  const insights = await prisma.userInsight.findMany({
    where: {
      userId,
      isArchived: false,
      isActive: true,
      OR: [
        { agentId: null }, // Global insights
        { agentId: agentId || undefined }, // Agent-specific
      ],
    },
    orderBy: [
      { lastUsedAt: { sort: 'desc', nulls: 'last' } },
      { confidence: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
    select: {
      id: true,
      category: true,
      content: true,
      confidence: true,
    },
  });

  if (insights.length === 0) return '';

  // Update lastUsedAt for these insights
  await prisma.userInsight.updateMany({
    where: { id: { in: insights.map((i) => i.id) } },
    data: { lastUsedAt: new Date() },
  });

  // Group by category for better organization
  const byCategory = new Map<InsightCategory, string[]>();
  for (const insight of insights) {
    const existing = byCategory.get(insight.category) || [];
    existing.push(insight.content);
    byCategory.set(insight.category, existing);
  }

  // Format for prompt
  let result = '## What I Remember About You\n';
  result += 'Based on our previous conversations, here is what I know:\n\n';

  for (const [category, items] of byCategory) {
    const categoryName = category.toLowerCase().replace('_', ' ');
    result += `**${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}:**\n`;
    for (const item of items) {
      result += `- ${item}\n`;
    }
    result += '\n';
  }

  result += 'Use this context naturally in your coaching. Reference relevant insights when appropriate.\n';

  return result;
}

/**
 * Get all insights for a user (for the insights review screen)
 */
export async function getUserInsights(
  userId: string,
  options: {
    agentId?: string;
    category?: InsightCategory;
    includeArchived?: boolean;
  } = {}
): Promise<any[]> {
  const where: any = { userId };

  if (options.agentId) {
    where.agentId = options.agentId;
  }
  if (options.category) {
    where.category = options.category;
  }
  if (!options.includeArchived) {
    where.isArchived = false;
  }

  return prisma.userInsight.findMany({
    where,
    include: {
      agent: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: [{ createdAt: 'desc' }],
  });
}

/**
 * Archive an insight (soft delete)
 */
export async function archiveInsight(
  insightId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.userInsight.updateMany({
    where: { id: insightId, userId },
    data: { isArchived: true },
  });
  return result.count > 0;
}

/**
 * Update an insight content (user edits)
 */
export async function updateInsight(
  insightId: string,
  userId: string,
  content: string
): Promise<boolean> {
  const result = await prisma.userInsight.updateMany({
    where: { id: insightId, userId },
    data: { content, userEdited: true, updatedAt: new Date() },
  });
  return result.count > 0;
}
