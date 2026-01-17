export interface WellnessAssessmentResponse {
  id: string;
  category: 'assessment' | 'symptoms' | 'sleep' | 'nutrition' | 'activity' | 'stress' | 'environment' | 'monitoring' | 'professional_care';
  title: string;
  content: string;
  keywords: string[];
  isMedicalDisclaimer: boolean;
}

export const WELLNESS_ASSESSMENT_RESPONSES: WellnessAssessmentResponse[] = [
  {
    id: 'well_being_overview',
    category: 'assessment',
    title: 'Overview of Reported Well-Being',
    content: `Based on the information provided, you appear to be experiencing a combination of physical discomfort, daily strain, and reduced recovery capacity. These impressions come from the way your symptoms and routines interact with each other, not from medical testing or clinical interpretation. Many people encounter similar periods when their energy, mood, or physical comfort shifts in response to lifestyle, sleep, stress, or environmental factors. The purpose of this report is to highlight patterns that may be useful for self-reflection and support, not to reach clinical conclusions.

Your reported symptoms seem to fluctuate throughout the day rather than remain constant, which can suggest that external factors such as energy cycles, hydration, nutrition habits, screen time, movement levels, or sleep timing may play a role in how you feel at different moments. These are general observations and not indicators of any specific medical condition.`,
    keywords: ['wellbeing', 'overview', 'patterns', 'fluctuation', 'lifestyle', 'factors'],
    isMedicalDisclaimer: true
  },
  {
    id: 'symptom_patterns',
    category: 'symptoms',
    title: 'Symptom Pattern Overview (Non-Diagnostic)',
    content: `You described experiencing one or more episodes of discomfort such as fatigue, low energy, headache, slight dizziness, digestive unease, or increased stress. These symptoms are common across many harmless scenarios, from dehydration to tension to insufficient rest. Because such symptoms are nonspecific, they cannot be tied to any singular explanation, and attempting to do so without proper clinical evaluation would be unsafe.

Instead, this report examines how symptoms behave:

Frequency: They appear intermittently rather than continuously.

Duration: Some symptoms resolve after rest, hydration, or breaks.

Intensity: You appear to have mild to moderate discomfort rather than severe symptoms.

Triggers: Symptoms may increase with exertion, stress, or inadequate sleep.

These patterns may suggest that your body is signaling a need for more recovery time, stable routines, or reduced daily strain. This is a reflection on general wellness, not a diagnosis of any condition.`,
    keywords: ['symptoms', 'patterns', 'frequency', 'duration', 'intensity', 'triggers', 'nondiagnostic'],
    isMedicalDisclaimer: true
  },
  {
    id: 'sleep_observations',
    category: 'sleep',
    title: 'Sleep and Rest Observations',
    content: `Your sleep habits appear inconsistent, and irregular sleep patterns can influence multiple aspects of daily well-being. Possible contributing factors include:

Variable bedtime or wake-up times

Insufficient total sleep hours

Interrupted sleep cycles

Exposure to screens or bright light prior to rest

Stress or mental overload affecting ability to relax

When sleep becomes irregular, your body may respond with decreased concentration, reduced motivation, increased irritability, and slower physical recovery from activity. None of these imply a medical condition—they simply reflect how your body reacts to inconsistent rest.

Improving sleep consistency often helps restore mental clarity and emotional stability. Small adjustments such as maintaining a steady bedtime, reducing caffeine late in the day, implementing calming habits, and keeping screens away from the sleeping area may help enhance rest quality over time.`,
    keywords: ['sleep', 'rest', 'consistency', 'bedtime', 'screens', 'recovery', 'mental_clarity'],
    isMedicalDisclaimer: true
  },
  {
    id: 'hydration_nutrition_trends',
    category: 'nutrition',
    title: 'Hydration and Nutrition Trends',
    content: `Your intake patterns may contribute to fluctuations in your daily comfort levels. Many people unintentionally underhydrate during busy days, which can lead to sensations such as lightheadedness, fatigue, or tension. Skipping meals, eating too quickly, or relying on high-sugar or processed foods can also affect energy levels.

Here are general non-medical observations:

Hydration might be inconsistent, particularly during active hours.

Meal timing varies, which can lead to drops or spikes in energy.

Nutrient balance may fluctuate, which might influence mood and stamina.

Improving hydration and adopting predictable eating patterns can be beneficial and may reduce some forms of discomfort related to lifestyle rhythm rather than illness.`,
    keywords: ['hydration', 'nutrition', 'patterns', 'energy', 'meals', 'consistency', 'fluctuations'],
    isMedicalDisclaimer: true
  },
  {
    id: 'activity_balance',
    category: 'activity',
    title: 'Activity and Movement Balance',
    content: `Your movement patterns appear uneven, with periods of high activity followed by long stretches of low movement. This may cause your body to feel overly strained at times and under-stimulated at others.

General wellness insights:

Sudden spikes in intense activity can lead to temporary fatigue.

Prolonged inactivity may contribute to stiffness or sluggishness.

Moderate, steady movement tends to support better energy flow.

A balanced approach—light stretching, steady walking, and avoiding sudden overexertion—may help regulate your energy levels throughout the day.`,
    keywords: ['activity', 'movement', 'balance', 'overexertion', 'inactivity', 'steady_movement', 'energy_flow'],
    isMedicalDisclaimer: true
  },
  {
    id: 'stress_recovery',
    category: 'stress',
    title: 'Stress, Mood, and Recovery',
    content: `Your descriptions suggest elevated stress or emotional strain. Stress can manifest physically, mentally, and emotionally even without any underlying medical issue. When stress accumulates without adequate recovery, individuals may notice:

Low motivation

Tension in body

Difficulty focusing

Irritability

Feeling overwhelmed

These responses are normal human reactions, not indicators of disease. Building habits that support recovery—such as taking breaks, breathing exercises, journaling, and lowering multitasking—can help manage stress.`,
    keywords: ['stress', 'mood', 'recovery', 'tension', 'motivation', 'focus', 'overwhelm'],
    isMedicalDisclaimer: true
  },
  {
    id: 'environmental_factors',
    category: 'environment',
    title: 'Environmental Factors',
    content: `Non-medical influences such as temperature changes, humidity, screen time, lighting, and noise can all impact comfort levels. Environmental contributors may include:

Dehydration from heat

Eye strain from screens

Fatigue from artificial lighting

Sensitivity to temperature changes

Reduced focus in noisy surroundings

Adjusting your environment may improve your daily comfort without implying any medical significance.`,
    keywords: ['environment', 'temperature', 'screens', 'lighting', 'noise', 'comfort', 'external_factors'],
    isMedicalDisclaimer: true
  },
  {
    id: 'monitoring_guidance',
    category: 'monitoring',
    title: 'When to Monitor Symptoms',
    content: `You should pay attention to any symptom that:

Lasts longer than usual

Becomes noticeably more intense

Interferes with daily functioning

Occurs suddenly with no clear reason

Monitoring changes is helpful for awareness, not diagnosis.`,
    keywords: ['monitoring', 'symptoms', 'changes', 'awareness', 'duration', 'intensity', 'functioning'],
    isMedicalDisclaimer: true
  },
  {
    id: 'professional_care_guidance',
    category: 'professional_care',
    title: 'When to Seek Professional Care',
    content: `Although this report is non-medical, it is important to know when symptoms deserve professional attention.

Seek medical evaluation if you experience:

Persistent high fever

Severe or worsening dizziness

Trouble breathing

Chest discomfort

Sudden weakness or numbness

Confusion or difficulty speaking

Severe dehydration or inability to keep fluids down

These symptoms may require urgent medical assessment.`,
    keywords: ['professional', 'medical', 'emergency', 'urgent', 'fever', 'dizziness', 'breathing', 'chest_pain'],
    isMedicalDisclaimer: true
  }
];

export function getWellnessAssessment(category: string, keywords?: string[]): WellnessAssessmentResponse | null {
  const responses = WELLNESS_ASSESSMENT_RESPONSES.filter(response => 
    response.category === category || 
    keywords?.some(keyword => response.keywords.includes(keyword))
  );
  
  return responses.length > 0 ? responses[0] : null;
}

export function getAllWellnessAssessments(): WellnessAssessmentResponse[] {
  return WELLNESS_ASSESSMENT_RESPONSES;
}

export function searchWellnessAssessment(query: string): WellnessAssessmentResponse[] {
  const lowercaseQuery = query.toLowerCase();
  return WELLNESS_ASSESSMENT_RESPONSES.filter(response => 
    response.title.toLowerCase().includes(lowercaseQuery) ||
    response.content.toLowerCase().includes(lowercaseQuery) ||
    response.keywords.some(keyword => keyword.includes(lowercaseQuery))
  );
}

export function getAssessmentCategories(): string[] {
  const categories = WELLNESS_ASSESSMENT_RESPONSES.map(response => response.category);
  return Array.from(new Set(categories));
}
