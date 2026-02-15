// =====================================================
// Shared gamification utilities
// Single source of truth for levels, points, and names
// Matches database trigger in 002_comments_events.sql
// =====================================================

export const LEVEL_THRESHOLDS = [
  { level: 9, points: 33015 },
  { level: 8, points: 8015 },
  { level: 7, points: 2015 },
  { level: 6, points: 515 },
  { level: 5, points: 155 },
  { level: 4, points: 65 },
  { level: 3, points: 20 },
  { level: 2, points: 5 },
  { level: 1, points: 0 },
]

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Người mới',
  2: 'Thành viên',
  3: 'Tích cực',
  4: 'Cộng tác viên',
  5: 'Chuyên gia',
  6: 'Cao cấp',
  7: 'Bậc thầy',
  8: 'Huyền thoại',
  9: 'Siêu sao',
}

export function getUserLevel(points: number): number {
  if (points >= 33015) return 9
  if (points >= 8015) return 8
  if (points >= 2015) return 7
  if (points >= 515) return 6
  if (points >= 155) return 5
  if (points >= 65) return 4
  if (points >= 20) return 3
  if (points >= 5) return 2
  return 1
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[level] || ''
}

export function getUserLevelInfo(points: number) {
  const level = getUserLevel(points)
  const name = getLevelName(level)
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === level)?.points || 0
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1)?.points
  const progress = nextThreshold
    ? ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100
  return { level, name, progress: Math.min(100, Math.max(0, progress)), nextThreshold }
}

// Shared constants
export const DEFAULT_MEMBER_COUNT = 0
export const DEFAULT_ONLINE_COUNT = 0

// Emoji avatars for deterministic avatar generation
export const EMOJI_AVATARS = ['🧑‍💻', '👨‍💼', '👩‍🎨', '👨‍🔬', '👩‍💻', '👨‍🎓', '👩‍🔧', '🧑‍🏫', '👨‍⚕️', '👩‍🚀']

export function getEmojiAvatar(name: string | null | undefined): string {
  if (!name) return '👤'
  const code = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return EMOJI_AVATARS[code % EMOJI_AVATARS.length]
}
