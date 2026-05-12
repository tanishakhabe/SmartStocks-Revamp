export const RECOMMEND_PREFERENCES_KEY = 'smartstocks_preferences';

const RISK = ['low', 'medium', 'high'];
const GROWTH = ['growth', 'balanced', 'income'];

export function getDefaultRecommendPreferences() {
  return {
    sectors: [],
    risk_tolerance: 'medium',
    growth_profile: 'balanced',
    investment_horizon: 5,
  };
}

/** Shape matches FastAPI `RecommendRequest` (POST /recommend/). */
export function loadRecommendPreferences() {
  const base = getDefaultRecommendPreferences();
  try {
    const raw = localStorage.getItem(RECOMMEND_PREFERENCES_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    const years = Number(parsed.investment_horizon);
    return {
      sectors: Array.isArray(parsed.sectors) ? parsed.sectors.filter(Boolean) : [],
      risk_tolerance: RISK.includes(parsed.risk_tolerance) ? parsed.risk_tolerance : base.risk_tolerance,
      growth_profile: GROWTH.includes(parsed.growth_profile) ? parsed.growth_profile : base.growth_profile,
      investment_horizon:
        Number.isFinite(years) && years >= 1 && years <= 10 ? Math.round(years) : base.investment_horizon,
    };
  } catch {
    return base;
  }
}

export function saveRecommendPreferences(prefs) {
  const normalized = {
    ...getDefaultRecommendPreferences(),
    ...prefs,
    sectors: Array.isArray(prefs.sectors) ? prefs.sectors.filter(Boolean) : [],
    risk_tolerance: RISK.includes(prefs.risk_tolerance) ? prefs.risk_tolerance : 'medium',
    growth_profile: GROWTH.includes(prefs.growth_profile) ? prefs.growth_profile : 'balanced',
    investment_horizon: (() => {
      const y = Number(prefs.investment_horizon);
      return Number.isFinite(y) && y >= 1 && y <= 10 ? Math.round(y) : 5;
    })(),
  };
  localStorage.setItem(RECOMMEND_PREFERENCES_KEY, JSON.stringify(normalized));
}
