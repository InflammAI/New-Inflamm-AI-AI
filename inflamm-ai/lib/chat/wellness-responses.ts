export interface WellnessResponse {
  id: string;
  category: 'physical' | 'nutrition' | 'sleep' | 'mental' | 'social' | 'routines' | 'environment' | 'mindbody' | 'boundaries' | 'resilience';
  title: string;
  content: string;
  keywords: string[];
  relatedTopics: string[];
}

export const WELLNESS_RESPONSES: WellnessResponse[] = [
  {
    id: 'holistic_overview',
    category: 'physical',
    title: 'Holistic Health Overview',
    content: `Maintaining overall health requires a balanced approach that integrates physical habits, mental and emotional resilience, restorative rest, and mindful daily routines. While no single practice guarantees optimal wellness, combining multiple positive behaviors has a compounding effect. Think of your health as an ecosystem—each element influences the others, sometimes in subtle but meaningful ways. This information is intended strictly for general wellness and personal development, not as medical advice or diagnosis.`,
    keywords: ['health', 'wellness', 'holistic', 'balance', 'overall'],
    relatedTopics: ['physical_activity', 'nutrition_basics', 'sleep_fundamentals', 'mental_wellness']
  },
  {
    id: 'physical_activity',
    category: 'physical',
    title: 'Physical Activity for Vitality',
    content: `Physical activity forms the cornerstone of overall vitality. Regular movement enhances strength, flexibility, endurance, cardiovascular health, metabolic function, and overall energy. Even modest increases in movement—like adding 10–20 minutes of walking each day—can create noticeable improvements in mood, stress levels, and general well-being.

Exercise doesn't need to be intense or highly structured to be beneficial. Consistency matters more than intensity. You can explore low-impact activities such as brisk walking, cycling, swimming, yoga, pilates, dancing, or light strength training. These improve circulation, mobility, and posture while reducing stiffness and supporting long-term physical comfort.

If you enjoy higher-intensity activities such as running, HIIT, or strength training, incorporating them gradually can enhance fitness levels and contribute to improved stamina over time. Always listen to your body and adjust activity to your comfort level.`,
    keywords: ['exercise', 'movement', 'walking', 'fitness', 'activity', 'strength', 'flexibility'],
    relatedTopics: ['mindbody_practices', 'listening_body', 'healthy_routines']
  },
  {
    id: 'nutrition_basics',
    category: 'nutrition',
    title: 'Balanced Nutrition Approach',
    content: `Balanced nutrition plays another essential role in wellness. Rather than strict dieting or restrictive rules, focus on nourishing your body with a wide variety of whole foods. This includes vegetables, fruits, lean proteins, plant-based proteins, whole grains, nuts, seeds, legumes, and foods rich in vitamins and minerals.

Aim to build meals that combine fiber, healthy fats, and protein to maintain steady energy levels throughout the day. Hydration is equally important. Water supports digestion, temperature regulation, circulation, and cognitive function. Small habits like keeping a water bottle nearby or drinking water before meals can help you stay consistently hydrated.

Eating mindfully—paying attention to hunger, fullness, and energy patterns—can also lead to more satisfying and intuitive food decisions.`,
    keywords: ['nutrition', 'food', 'diet', 'hydration', 'eating', 'whole foods', 'protein', 'fiber'],
    relatedTopics: ['mindful_eating', 'hydration_habits', 'energy_balance']
  },
  {
    id: 'sleep_fundamentals',
    category: 'sleep',
    title: 'Restorative Sleep Practices',
    content: `Sleep is one of the most powerful rejuvenation tools available. Good sleep quality enhances cognitive function, emotional balance, metabolism, and immune support. Establishing a consistent sleep-wake schedule improves the body's rhythm.

Reducing bright screens before bed, creating a calming bedtime routine, and keeping your sleep space cool, quiet, and comfortable can help your body prepare for rest naturally. Practices such as light stretching, reading, journaling, or listening to relaxing music can calm the mind before bedtime.

If your mind races at night, it may help to write down thoughts earlier in the evening to clear mental clutter. Creating stability around sleep habits often leads to deeper, more restorative rest.`,
    keywords: ['sleep', 'rest', 'bedtime', 'routine', 'screens', 'schedule', 'restoration'],
    relatedTopics: ['sleep_environment', 'bedtime_routine', 'mental_clarity']
  },
  {
    id: 'mental_wellness',
    category: 'mental',
    title: 'Mental and Emotional Wellness',
    content: `Mental and emotional wellness is equally essential. Stress is an unavoidable part of life, but how we manage it influences our overall well-being. Simple practices like mindfulness, controlled breathing, spending time in nature, social connection, journaling, or creative activities can significantly reduce stress and increase mental clarity.

Daily moments of slowness—where you intentionally pause—can counterbalance the demands of a busy routine. Mindfulness techniques such as observing your breath, grounding exercises, or guided relaxation can reduce tension and help you maintain presence. Taking regular mental breaks throughout the day prevents overwhelm and conserves emotional energy.`,
    keywords: ['stress', 'mental', 'emotional', 'mindfulness', 'breathing', 'relaxation', 'clarity'],
    relatedTopics: ['breathing_techniques', 'mindfulness_practices', 'stress_management']
  },
  {
    id: 'social_connection',
    category: 'social',
    title: 'Social Connection and Well-being',
    content: `Social connection also plays a meaningful role in well-being. Having supportive relationships, meaningful conversations, or even brief positive interactions can enhance emotional resilience. Humans are wired for connection, and feeling supported can buffer the effects of stress.

This does not require a large social circle; even one or two trusted relationships can create a sense of belonging and stability. Quality of connection often matters more than quantity. Regular, meaningful interactions—whether with friends, family, or community members—contribute to emotional health and provide support during challenging times.`,
    keywords: ['social', 'connection', 'relationships', 'support', 'community', 'belonging'],
    relatedTopics: ['emotional_resilience', 'stress_buffer', 'meaningful_interactions']
  },
  {
    id: 'healthy_routines',
    category: 'routines',
    title: 'Building Healthy Routines',
    content: `Healthy routines develop most successfully through consistency and gradual improvements. Creating small, achievable habits is more effective than attempting to overhaul your entire lifestyle at once.

For example, adding one nutrient-dense snack per day, taking a 10-minute walk after meals, or practicing five minutes of breathing can eventually become natural parts of your daily routine. Tracking habits or using reminders can help build momentum. Motivation fluctuates, but habits persist when anchored to existing routines—such as stretching after brushing your teeth or drinking water when you wake up.

The key is starting small and building gradually. Focus on consistency over intensity, and celebrate small wins along the way.`,
    keywords: ['routines', 'habits', 'consistency', 'gradual', 'small_steps', 'tracking', 'reminders'],
    relatedTopics: ['habit_formation', 'consistency_matters', 'small_wins']
  },
  {
    id: 'environmental_influence',
    category: 'environment',
    title: 'Environmental Influence on Habits',
    content: `Your environment influences your habits more than you may realize. Keeping healthy food visible, organizing living spaces, reducing clutter, and designing an intentional daily environment can reduce stress and improve focus.

You can also set up simple triggers that guide positive behaviors, such as keeping walking shoes near the door or leaving a water bottle on your desk. These environmental cues make healthy choices more automatic and require less willpower.

Consider your physical spaces: Is your bedroom conducive to rest? Is your kitchen set up for healthy meal preparation? Small environmental adjustments can have outsized effects on your daily behaviors and overall well-being.`,
    keywords: ['environment', 'space', 'organization', 'triggers', 'cues', 'setup', 'design'],
    relatedTopics: ['habit_triggers', 'space_optimization', 'environmental_design']
  },
  {
    id: 'listening_body',
    category: 'physical',
    title: 'Listening to Your Body',
    content: `Listening to your body is a crucial skill. Everyone has different energy levels, preferences, and rhythms. Some people function best with morning activity, while others thrive with evening routines.

Pay attention to how foods, activities, and environments make you feel. Adjusting your habits based on personal responses creates a more sustainable and adaptive health journey. This might mean recognizing when you need rest versus when you have energy for movement, or noticing which foods energize you versus which ones cause discomfort.

Your body provides valuable feedback through energy levels, digestion, mood, and physical sensations. Learning to interpret and honor these signals helps create a more personalized and effective approach to wellness.`,
    keywords: ['body', 'listening', 'signals', 'energy', 'rhythms', 'personal', 'feedback'],
    relatedTopics: ['intuitive_eating', 'energy_management', 'personal_rhythms']
  },
  {
    id: 'mindbody_practices',
    category: 'mindbody',
    title: 'Mind-Body Practices',
    content: `Mind-body practices can be especially powerful. Yoga, tai chi, stretching, and slow movement help relax muscles, improve mobility, and calm the mind simultaneously. Even a few minutes of gentle movement can relieve tension accumulated from sitting or mental stress.

Deep breathing activates the body's relaxation response and can help slow heart rate, reduce muscle tension, and improve clarity. Methods such as belly breathing, box breathing, or prolonged exhalation breathing are approachable techniques that many people find soothing.

These practices bridge the gap between physical and mental wellness, recognizing that our mental state affects our body and vice versa. Regular practice can improve both physical comfort and mental clarity.`,
    keywords: ['yoga', 'tai chi', 'stretching', 'breathing', 'relaxation', 'mindbody', 'movement'],
    relatedTopics: ['breathing_techniques', 'gentle_movement', 'relaxation_response']
  },
  {
    id: 'healthy_boundaries',
    category: 'boundaries',
    title: 'Healthy Boundaries for Wellness',
    content: `Healthy boundaries are also part of wellness. Overcommitment, poor time management, or difficulty saying no can lead to chronic stress. Learning to prioritize your time, energy, and emotional space supports long-term well-being.

You can create boundaries by separating work and rest times, reducing unnecessary stressors, and allowing yourself time to recharge. Progress is not linear, and taking breaks is a sign of wisdom, not weakness.

Boundaries might look like: setting specific work hours, limiting screen time, saying no to additional commitments when you're at capacity, or protecting your morning routine. These protective measures help maintain the energy needed for sustainable wellness practices.`,
    keywords: ['boundaries', 'time', 'energy', 'commitments', 'recharge', 'work-life', 'saying_no'],
    relatedTopics: ['stress_prevention', 'energy_management', 'self_care']
  },
  {
    id: 'building_resilience',
    category: 'resilience',
    title: 'Building Resilience',
    content: `Building resilience means adapting to change and recovering from challenges. This involves cultivating optimism, practicing gratitude, reframing negative thoughts, and developing coping strategies.

Resilience doesn't eliminate stress but increases your capacity to navigate it. Reflective practices—such as writing down positive experiences or recognizing small daily wins—can shift mindset over time.

Resilience is built through facing challenges and learning from them, not by avoiding difficulties. Each time you navigate a stressful situation successfully, you build confidence and coping skills for future challenges. Supportive relationships and self-compassion are also key components of resilience.`,
    keywords: ['resilience', 'adaptation', 'recovery', 'optimism', 'gratitude', 'coping', 'challenges'],
    relatedTopics: ['gratitude_practice', 'cognitive_reframing', 'support_systems']
  },
  {
    id: 'personal_wellness_journey',
    category: 'resilience',
    title: 'Your Personal Wellness Journey',
    content: `Wellness is personal and constantly evolving. What works for someone else may not work for you, and that's completely normal. The goal is not perfection but sustainable balance.

You can continue exploring different activities, foods, routines, and techniques to find what aligns with your lifestyle and preferences. Over time, small choices accumulate into meaningful results.

Be patient with yourself as you discover what works best for your unique body, lifestyle, and circumstances. Your wellness journey is yours alone, and it will naturally evolve as your life circumstances change. The most effective approach is one that feels authentic and maintainable for you.`,
    keywords: ['personal', 'journey', 'evolution', 'balance', 'sustainable', 'authentic', 'individual'],
    relatedTopics: ['self_compassion', 'personalization', 'sustainable_habits']
  },
  {
    id: 'ongoing_wellness_process',
    category: 'resilience',
    title: 'Wellness as an Ongoing Process',
    content: `Maintaining a healthy lifestyle is an ongoing process that involves consistent choices rather than short-term fixes. A key part of this process is understanding how different aspects of your daily habits influence one another. Health is not built in a single moment—it accumulates through thousands of small decisions over weeks, months, and years. By approaching wellness with patience and curiosity rather than pressure or perfectionism, you create a foundation that supports sustainable growth.`,
    keywords: ['ongoing', 'process', 'consistent', 'choices', 'patience', 'curiosity', 'sustainable'],
    relatedTopics: ['small_decisions', 'patience_curiosity', 'sustainable_growth']
  },
  {
    id: 'energy_management',
    category: 'physical',
    title: 'Energy Management and Natural Rhythms',
    content: `One important concept is energy management. Many people think productivity and wellness are about maximizing output, but in reality, they depend on balancing effort and recovery. Your energy fluctuates throughout the day based on sleep, nutrition, stress levels, physical activity, emotional state, and mental focus.

Becoming aware of your personal energy patterns allows you to align tasks with your natural rhythms. For example, you might schedule mentally demanding tasks during your most alert hours and lighter tasks when your energy dips. Incorporating strategic breaks—such as stretching, walking briefly, or looking away from screens—helps maintain mental clarity.`,
    keywords: ['energy', 'management', 'rhythms', 'recovery', 'breaks', 'mental_clarity', 'patterns'],
    relatedTopics: ['strategic_breaks', 'natural_rhythms', 'energy_awareness']
  },
  {
    id: 'habit_stacking',
    category: 'routines',
    title: 'Habit Stacking for Easy Adoption',
    content: `Another valuable area is habit stacking, which encourages linking a new habit to an established one. For example, if you already brush your teeth every morning, you can add 30 seconds of deep breathing right afterward. If you drink coffee daily, use that moment to drink a glass of water first.

Habit stacking reduces friction and makes new routines easier to adopt because they piggyback on behaviors your brain already recognizes as automatic. This approach leverages existing neural pathways, making new habits feel more natural and requiring less willpower to maintain.`,
    keywords: ['habit_stacking', 'linking', 'automatic', 'friction', 'neural_pathways', 'willpower'],
    relatedTopics: ['habit_formation', 'automatic_behaviors', 'routine_building']
  },
  {
    id: 'environmental_design',
    category: 'environment',
    title: 'Environmental Design for Wellness',
    content: `Your environment can either support or hinder healthy behaviors. Organizing your living and working spaces in ways that reduce stress and increase clarity can significantly influence how you feel. Consider placing healthy foods at eye level, reducing clutter, setting up a comfortable area for relaxation, and creating a designated space for movement or stretching.

Even small adjustments like adding plants, natural light, or calming scents can elevate your daily experience. Similarly, reducing excessive notifications or digital noise can improve mental clarity and reduce stress. Your environment should work for you, not against you.`,
    keywords: ['environment', 'design', 'space', 'clutter', 'plants', 'light', 'notifications'],
    relatedTopics: ['space_optimization', 'digital_noise', 'environmental_cues']
  },
  {
    id: 'reflective_awareness',
    category: 'mental',
    title: 'Reflective Awareness and Pattern Recognition',
    content: `Another meaningful practice is reflective awareness, which includes journaling, self-check-ins, or taking quiet moments throughout the day to observe your thoughts and feelings. Reflection helps identify patterns in behavior, triggers for stress, and habits that truly support your well-being.

Writing down three small wins each day—even simple ones like drinking more water or taking a short walk—can build confidence and reinforce positive progress. Gratitude journaling is another powerful tool that shifts focus from stressors to supportive experiences. These practices create self-awareness that guides better choices.`,
    keywords: ['reflection', 'awareness', 'journaling', 'patterns', 'gratitude', 'self_check', 'wins'],
    relatedTopics: ['gratitude_practice', 'pattern_recognition', 'self_awareness']
  },
  {
    id: 'emotional_regulation',
    category: 'mental',
    title: 'Emotional Regulation and Resilience',
    content: `Emotional regulation is a key part of wellness. Life naturally includes challenges, unexpected events, and emotional ups and downs. Developing the ability to pause before reacting can create space for more thoughtful decisions.

Strategies such as naming emotions ("I'm feeling overwhelmed") can reduce their intensity. Allowing yourself permission to rest, reset, or take breaks supports emotional resilience. Maintaining clear communication in relationships, setting limits when needed, and seeking connection during difficult periods also contribute to emotional stability.`,
    keywords: ['emotional', 'regulation', 'resilience', 'pausing', 'naming_emotions', 'boundaries', 'connection'],
    relatedTopics: ['emotional_stability', 'thoughtful_decisions', 'relationship_boundaries']
  },
  {
    id: 'hydration_beyond_basics',
    category: 'nutrition',
    title: 'Advanced Hydration Strategies',
    content: `Hydration, while simple, has a surprisingly large impact on cognitive function, mood, and energy. Many people underestimate how much water they need based on activity, climate, and individual differences. Drinking water regularly throughout the day rather than only when thirsty helps maintain consistent hydration levels.

You can set gentle reminders, use a bottle with measurement markers, or associate water intake with common activities. Proper hydration supports brain function, physical performance, temperature regulation, and overall energy levels. It's one of the simplest yet most impactful wellness habits.`,
    keywords: ['hydration', 'water', 'cognitive', 'energy', 'reminders', 'consistency', 'climate'],
    relatedTopics: ['cognitive_function', 'energy_levels', 'hydration_reminders']
  },
  {
    id: 'nutrition_balance_advanced',
    category: 'nutrition',
    title: 'Personalized Nutrition Balance',
    content: `Nutrition balance goes beyond food categories—it includes how food makes you feel emotionally and energetically. Some people thrive with frequent small meals, while others prefer fewer, larger meals. Paying attention to how your body responds to different patterns allows you to tune your eating habits to your personal needs.

Enjoying meals slowly, noticing flavors, and eating in a calm environment can support digestion and satisfaction. Adding variety ensures a wider range of nutrients that support overall vitality. Your eating pattern should serve your lifestyle, not the other way around.`,
    keywords: ['nutrition', 'balance', 'personalized', 'patterns', 'digestion', 'satisfaction', 'variety'],
    relatedTopics: ['mindful_eating', 'personal_patterns', 'digestive_health']
  },
  {
    id: 'movement_variety',
    category: 'physical',
    title: 'Movement Variety and Enjoyment',
    content: `Movement variety is another helpful concept. Instead of relying on a single form of exercise, mixing different types of movement engages different muscles and prevents burnout. A combination of strength, flexibility, cardiovascular activity, and mobility work provides a balanced approach.

Even non-structured movement—like playing, gardening, doing chores, or taking stairs—counts toward your daily activity. The more enjoyable the movement, the more likely you are to maintain it long-term. Movement should feel like play, not punishment.`,
    keywords: ['movement', 'variety', 'strength', 'flexibility', 'cardiovascular', 'mobility', 'enjoyment'],
    relatedTopics: ['balanced_movement', 'playful_activity', 'structured_exercise']
  },
  {
    id: 'stress_integration',
    category: 'mental',
    title: 'Integrated Stress Management',
    content: `Stress management techniques work best when integrated into daily life. Techniques such as breathing exercises, mindfulness, stretching, music, walking outside, or simply taking a moment of pause can reduce stress accumulation.

Spending time in nature has been shown to improve mood and mental clarity. Even a few minutes of sunlight exposure can positively influence your energy and sleep rhythms. The key is making these practices regular parts of your day rather than emergency responses to overwhelm.`,
    keywords: ['stress', 'integration', 'nature', 'sunlight', 'mindfulness', 'breathing', 'daily_practice'],
    relatedTopics: ['nature_exposure', 'sunlight_benefits', 'daily_stress_management']
  },
  {
    id: 'technology_boundaries',
    category: 'environment',
    title: 'Healthy Technology Boundaries',
    content: `Technology boundaries can greatly improve well-being. Screens and notifications pull attention in many directions, making it harder to focus and relax. Creating tech-free zones—such as during meals or before bedtime—can contribute to mental calmness.

Setting time limits for certain apps or creating a morning routine that avoids screens can also reduce overwhelm. Your relationship with technology should be intentional, not reactive. Design your tech use to serve your wellness goals rather than distract from them.`,
    keywords: ['technology', 'boundaries', 'screens', 'notifications', 'tech_free', 'intentional', 'focus'],
    relatedTopics: ['digital_wellness', 'screen_time', 'notification_management']
  },
  {
    id: 'routine_flexibility',
    category: 'routines',
    title: 'Flexible Routine Mindset',
    content: `Routine flexibility is equally important. Rigid health rules can create unnecessary stress. Instead, allow room for variation based on your energy, schedule, and environment. If you miss a workout or eat differently than planned, treat it as part of the natural cycle rather than a failure.

A flexible mindset prevents discouragement and supports long-term consistency. Life is unpredictable, and your wellness approach should accommodate that reality rather than fighting against it. Adaptability is a strength, not a weakness.`,
    keywords: ['flexibility', 'routine', 'adaptability', 'variation', 'natural_cycle', 'consistency', 'stress_free'],
    relatedTopics: ['adaptive_wellness', 'life_variations', 'stress_reduction']
  },
  {
    id: 'mindset_shifts',
    category: 'resilience',
    title: 'Powerful Mindset Shifts',
    content: `Mindset shifts often have the biggest impact on health outcomes. Viewing wellness as a journey rather than a destination removes pressure. Instead of aiming for perfection, aim for progress. Celebrating small improvements—like drinking more water, taking a walk, or choosing a nourishing meal—reinforces positive behavior.

Progress compounds over time, and even small actions done consistently lead to significant long-term results. Your mindset about wellness matters as much as the specific actions you take. Cultivate curiosity, compassion, and patience with yourself.`,
    keywords: ['mindset', 'progress', 'journey', 'celebration', 'compounding', 'curiosity', 'compassion'],
    relatedTopics: ['progress_over_perfection', 'celebrating_wins', 'compound_growth']
  },
  {
    id: 'self_compassion',
    category: 'resilience',
    title: 'Self-Compassion in Wellness',
    content: `Finally, self-compassion is one of the most powerful aspects of wellness. Many people push themselves harshly or judge themselves when they fall short of expectations. Practicing patience, understanding your limits, and treating yourself kindly can dramatically improve your relationship with health.

Well-being grows in environments of encouragement, not criticism. The way you speak to yourself matters as much as the actions you take. Treat yourself with the same kindness and understanding you would offer a friend on their wellness journey.`,
    keywords: ['compassion', 'self_kindness', 'patience', 'encouragement', 'inner_dialogue', 'understanding'],
    relatedTopics: ['inner_kindness', 'self_talk', 'encouraging_environment']
  }
];

export function getWellnessResponse(category: string, keywords?: string[]): WellnessResponse | null {
  const responses = WELLNESS_RESPONSES.filter(response => 
    response.category === category || 
    keywords?.some(keyword => response.keywords.includes(keyword))
  );
  
  return responses.length > 0 ? responses[0] : null;
}

export function getAllWellnessResponses(): WellnessResponse[] {
  return WELLNESS_RESPONSES;
}

export function getWellnessCategories(): string[] {
  const categories = WELLNESS_RESPONSES.map(response => response.category);
  return Array.from(new Set(categories));
}

export function searchWellnessContent(query: string): WellnessResponse[] {
  const lowercaseQuery = query.toLowerCase();
  return WELLNESS_RESPONSES.filter(response => 
    response.title.toLowerCase().includes(lowercaseQuery) ||
    response.content.toLowerCase().includes(lowercaseQuery) ||
    response.keywords.some(keyword => keyword.includes(lowercaseQuery))
  );
}
