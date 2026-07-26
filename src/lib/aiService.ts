import { saveChatMessage } from './firestoreService';
import { AIChatMessage } from '../types';

export interface PromptOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'lesson_plan' | 'homework' | 'quiz' | 'parent_notice' | 'activity' | 'general';
  samplePrompt: string;
}

export const PRESET_PROMPTS: PromptOption[] = [
  {
    id: 'lesson_plan',
    title: 'Generate Lesson Plan',
    description: 'Create structured plans for science, math, or reading',
    icon: 'menu_book',
    category: 'lesson_plan',
    samplePrompt: 'Create an interactive 45-minute Science lesson plan for Grade 3 on "The Water Cycle" with hands-on activities.'
  },
  {
    id: 'quiz',
    title: 'Create Quiz / Exam',
    description: 'Generate multiple choice and short answer quizzes',
    icon: 'quiz',
    category: 'quiz',
    samplePrompt: 'Generate a 5-question Math quiz for Grade 2 on basic addition and word problems with an answer key.'
  },
  {
    id: 'parent_notice',
    title: 'Write Parent Notice',
    description: 'Draft professional notices for trips or events',
    icon: 'mail',
    category: 'parent_notice',
    samplePrompt: 'Write a warm, professional notice to parents about the upcoming Science Fair on Oct 24th at 9:00 AM.'
  },
  {
    id: 'activity',
    title: 'Classroom Activities',
    description: 'Engaging brain breaks & group games',
    icon: 'sports_esports',
    category: 'activity',
    samplePrompt: 'Suggest 3 fun 10-minute classroom team-building activities for Grade 3 students requiring minimal prep.'
  },
  {
    id: 'homework',
    title: 'Create Homework',
    description: 'Practice worksheets and creative assignments',
    icon: 'assignment',
    category: 'homework',
    samplePrompt: 'Draft a 15-minute English reading comprehension homework sheet for Grade 3 about autumn animals.'
  }
];

export async function sendAIPrompt(
  prompt: string,
  category?: 'lesson_plan' | 'homework' | 'quiz' | 'parent_notice' | 'activity' | 'general'
): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, category })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error('AI Service Error:', error);
    throw error;
  }
}
