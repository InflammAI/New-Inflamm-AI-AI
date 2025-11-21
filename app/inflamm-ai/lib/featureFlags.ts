export const FEATURE_FLAGS = {
  FEATURE_VYTAP: true,
  FEATURE_VITALSYNC: true,
  FEATURE_CHAT: true,
  FEATURE_SCICAST: true,
  FEATURE_BLOG: true,
  FEATURE_QUANTUM_BG: true,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlagKey): boolean => {
  return FEATURE_FLAGS[flag] ?? false;
};
