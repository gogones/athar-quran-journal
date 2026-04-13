import { getDailyVerseNumber } from '../services/quranApi';

const PROMPTS = [
  "What is Allah teaching you through this verse today?",
  "How does this verse apply to a challenge you're facing right now?",
  "What would change in your life if you truly lived by this verse?",
  "Which word or phrase in this verse stands out most to you, and why?",
  "How does this verse relate to your relationship with others?",
  "What does this verse reveal about Allah's mercy?",
  "If you could ask Allah one question about this verse, what would it be?",
  "How can you act on this verse before the day ends?",
  "What feeling does this verse bring — and what does that tell you?",
  "Who in your life needs to hear the message of this verse?",
  "How does this verse connect to something you've been struggling with?",
  "What does this verse ask you to let go of?",
  "How does this verse change the way you see your day?",
  "What would the Prophet ﷺ want you to take from this verse?",
  "How does this verse speak to your heart right now?",
  "What habit could you build inspired by this verse?",
  "Does this verse comfort you, challenge you, or both? Why?",
  "How does this verse deepen your gratitude to Allah?",
  "What do you want to remember about this verse a year from now?",
  "How does this verse connect to the last thing you prayed for?",
  "What does this verse teach about patience?",
  "Is there someone you should forgive after reading this verse?",
  "How has your understanding of this verse grown over time?",
  "What does this verse ask of your heart — not just your actions?",
  "How would you explain this verse to a child?",
  "What fear does this verse address?",
  "How does this verse inspire you to be a better person today?",
  "What does this verse say about the life of this world vs. the next?",
  "How does this verse remind you that Allah is near?",
  "What small step can you take today because of this verse?",
];

export function getDailyPrompt(): string {
  const index = (getDailyVerseNumber() - 1) % PROMPTS.length;
  return PROMPTS[index];
}
