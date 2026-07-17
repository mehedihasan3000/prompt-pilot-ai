import * as plannerService from './planner.service';
import * as analyzerService from './analyzer.service';
import * as contextCheckerService from './contextChecker.service';
import * as weaknessDetectorService from './weaknessDetector.service';
import * as followUpService from './followUp.service';
import * as optimizerService from './optimizer.service';
import * as variantGeneratorService from './variantGenerator.service';
import * as qualityEvaluatorService from './qualityEvaluator.service';
import * as recommenderService from './recommender.service';
import * as autoTaggerService from './autoTagger.service';

export interface OrchestratorInput {
  originalPrompt: string;
  goal: string;
  targetModel: string;
  tone: string;
  language: string;
  outputLength: string;
  outputFormat: string;
  audience?: string;
  category?: string;
  extraContext?: string;
  constraints?: string;
  examples?: string;
  creativityLevel?: number;
  tags?: string[];
}

export interface OrchestratorResult {
  plan: { intent: string; taskType: string };
  analysis: { score: number; strengths: string[]; weaknesses: string[]; missingContext: string[]; analysis: string };
  contextCheck: { missingContextPoints: string[]; requiredFollowUps: string[] };
  followUpQuestions: string[];
  optimizedPrompt: string;
  explanation: string;
  changesMade: string[];
  variants: { type: string; content: string }[];
  scoreResult: { totalScore: number; clarity: number; context: number; specificity: number; constraints: number; outputFormat: number; toneAlignment: number; grade: string; explanation: string };
  recommendations: { title: string; description: string; priority: string }[];
  autoTags: { tags: string[]; category: string };
}

export async function runFullWorkflow(input: OrchestratorInput): Promise<OrchestratorResult> {
  const plan = await plannerService.plan(input);

  const analysis = await analyzerService.analyze({
    originalPrompt: input.originalPrompt,
    goal: input.goal,
    targetModel: input.targetModel,
    tone: input.tone,
    audience: input.audience,
    extraContext: input.extraContext,
    constraints: input.constraints,
  });

  const contextCheck = await contextCheckerService.checkContext({
    originalPrompt: input.originalPrompt,
    goal: input.goal,
    audience: input.audience,
    extraContext: input.extraContext,
  });

  const weaknessResult = await weaknessDetectorService.detectWeaknesses({
    originalPrompt: input.originalPrompt,
    goal: input.goal,
    constraints: input.constraints,
    tone: input.tone,
    audience: input.audience,
  });

  const followUpQuestions = await followUpService.generateFollowUps({
    originalPrompt: input.originalPrompt,
    goal: input.goal,
    missingContext: [...analysis.missingContext, ...contextCheck.missingContextPoints],
    weaknesses: [...analysis.weaknesses, ...weaknessResult.weaknesses],
  });

  const optimizerResult = await optimizerService.optimize(input);

  const variants = await variantGeneratorService.generateVariants({
    originalPrompt: input.originalPrompt,
    optimizedPrompt: optimizerResult.optimizedPrompt,
    goal: input.goal,
    targetModel: input.targetModel,
    tone: input.tone,
  });

  const scoreResult = await qualityEvaluatorService.evaluateQuality({
    originalPrompt: input.originalPrompt,
    optimizedPrompt: optimizerResult.optimizedPrompt,
    goal: input.goal,
    targetModel: input.targetModel,
    tone: input.tone,
  });

  const recommendations = await recommenderService.recommend({
    originalPrompt: input.originalPrompt,
    optimizedPrompt: optimizerResult.optimizedPrompt,
    score: analysis.score,
    scoreBreakdown: {
      clarity: analysis.clarity,
      context: analysis.context,
      specificity: analysis.specificity,
      constraints: analysis.constraints,
      outputFormat: analysis.outputFormat,
      toneAlignment: analysis.toneAlignment,
    },
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
  });

  const autoTags = await autoTaggerService.autoTag({
    originalPrompt: input.originalPrompt,
    goal: input.goal,
    category: input.category,
    outputFormat: input.outputFormat,
    targetModel: input.targetModel,
  });

  return {
    plan: { intent: plan.intent, taskType: plan.taskType },
    analysis: {
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingContext: analysis.missingContext,
      analysis: analysis.analysis,
    },
    contextCheck: {
      missingContextPoints: contextCheck.missingContextPoints,
      requiredFollowUps: contextCheck.requiredFollowUps,
    },
    followUpQuestions: followUpQuestions.questions,
    optimizedPrompt: optimizerResult.optimizedPrompt,
    explanation: optimizerResult.explanation,
    changesMade: optimizerResult.changesMade,
    variants: variants.variants.map(v => ({ type: v.type, content: v.content })),
    scoreResult: {
      totalScore: scoreResult.totalScore,
      clarity: scoreResult.clarity,
      context: scoreResult.context,
      specificity: scoreResult.specificity,
      constraints: scoreResult.constraints,
      outputFormat: scoreResult.outputFormat,
      toneAlignment: scoreResult.toneAlignment,
      grade: scoreResult.grade,
      explanation: scoreResult.explanation,
    },
    recommendations: recommendations.recommendations,
    autoTags: { tags: autoTags.tags, category: autoTags.category },
  };
}
