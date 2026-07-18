import { Request, Response, NextFunction } from 'express';
import * as optimizerService from '../services/ai/optimizer.service';
import * as analyzerService from '../services/ai/analyzer.service';
import * as variantGeneratorService from '../services/ai/variantGenerator.service';
import * as qualityEvaluatorService from '../services/ai/qualityEvaluator.service';
import * as recommenderService from '../services/ai/recommender.service';
import * as chatAssistantService from '../services/ai/chatAssistant.service';
import * as autoTaggerService from '../services/ai/autoTagger.service';
import * as orchestratorService from '../services/ai/orchestrator.service';
import * as conversationService from '../services/conversation.service';

export async function analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await orchestratorService.runFullWorkflow(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function optimize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await optimizerService.optimize(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function generateVariants(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await variantGeneratorService.generateVariants(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function score(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await qualityEvaluatorService.evaluateQuality(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await recommenderService.recommend(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function chat(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { conversationId, message, conversationHistory } = req.body;

    if (conversationId) {
      await conversationService.addMessage(conversationId, 'user', message);
    }

    const result = await chatAssistantService.chat({ message, conversationHistory });

    if (conversationId) {
      await conversationService.addMessage(conversationId, 'assistant', result.reply);
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function autoTag(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await autoTaggerService.autoTag(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
