// Simple chat system - only internal wellness responses
export type {
  ChatMessage,
  ChatResponse
} from './chat-service';

export {
  SimpleChatService
} from './chat-service';

export type {
  WellnessResponse
} from './wellness-responses';

export {
  getWellnessResponse,
  getAllWellnessResponses,
  getWellnessCategories,
  searchWellnessContent
} from './wellness-responses';

export type {
  WellnessAssessmentResponse
} from './wellness-assessment';

export {
  getWellnessAssessment,
  getAllWellnessAssessments,
  getAssessmentCategories,
  searchWellnessAssessment
} from './wellness-assessment';

// Factory function for easy initialization
import { SimpleChatService } from './chat-service';

export function createChatService(): SimpleChatService {
  return new SimpleChatService();
}
