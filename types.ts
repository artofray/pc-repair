export interface AIStep {
  title: string;
  details: string;
  command?: string;
  warning?: string;
}

export interface AIResponse {
    step: AIStep;
    sessionComplete: boolean;
    summary?: string;
}

export type UserFeedbackType = 'success' | 'error';

export interface UserFeedback {
    type: UserFeedbackType;
    message?: string;
}

export type SessionMessage = {
    id: string;
} & (
    | { type: 'ai_step'; step: AIStep; }
    | { type: 'user_feedback'; feedback: UserFeedback; }
    | { type: 'ai_summary'; summary: string; step: AIStep; }
);
