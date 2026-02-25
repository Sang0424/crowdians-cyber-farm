import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ══════════════════════════════════════
// 📊 User Stats & Currency System
// ══════════════════════════════════════

export interface UserStats {
  level: number
  exp: number
  maxExp: number
  points: number // Gold (G)
  stamina: number
  maxStamina: number
  trust: number // 신뢰도 (기본 1000)
  intelligence: number // 지능 — 아카데미 활동으로 증가
  courage: number // 용기 — 모험 노드 클리어로 증가
  intimacy: number // 친밀도 — 채팅 활동으로 증가
  dailyChatExp: number // 오늘 채팅으로 획득한 EXP (일일 50 상한)
}

export interface Character {
  id: string
  name: string
  image: string
}

export interface UserProfile {
  uid: string
  email: string | null
  nickname: string
  photoURL: string | null
  stats: UserStats
  character?: Character
}

// ── Level-up formula ──
// maxExp = level * 100
// On level-up: stamina resets to maxStamina
function calcMaxExp(level: number): number {
  return level * 100
}

// ── Daily limits ──
const MAX_DAILY_CHAT_EXP = 50
const STAMINA_PER_MESSAGE = 1
const EXP_PER_MESSAGE = 2

// ── Default stats (requirements.md §2.1) ──
const DEFAULT_STATS: UserStats = {
  level: 1,
  exp: 0,
  maxExp: 100,
  points: 0, // Gold
  stamina: 20,
  maxStamina: 20,
  trust: 1000,
  intelligence: 0,
  courage: 0,
  intimacy: 0,
  dailyChatExp: 0,
}

interface UserState {
  user: UserProfile | null
  isLoading: boolean

  // ── Basic setters ──
  setUser: (user: UserProfile | null) => void
  fetchUser: (uid: string) => Promise<void>
  logout: () => void
  initializeDefaultUser: () => void

  // ── Currency & Stats actions ──
  addGold: (amount: number) => void
  addExp: (amount: number) => void
  consumeStamina: (amount?: number) => boolean // returns false if insufficient
  addTrust: (delta: number) => void
  addIntelligence: (amount: number) => void
  addCourage: (amount: number) => void
  addIntimacy: (amount: number) => void
  addChatExp: (amount?: number) => number // returns actual EXP added
  resetDaily: () => void
}

// TODO: Replace with actual API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      fetchUser: async (uid: string) => {
        set({ isLoading: true })
        try {
          // Mock fetch - replace with axios call to FastAPI
          // const response = await axios.get(`${API_URL}/users/${uid}`);
          // set({ user: response.data });

          set({
            user: {
              uid,
              email: 'test@example.com',
              nickname: '용감한 귤',
              photoURL: null,
              stats: { ...DEFAULT_STATS },
            },
          })
        } catch (error) {
          console.error('Failed to fetch user:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => set({ user: null }),

      initializeDefaultUser: () => {
        const { user } = get()
        if (!user) {
          set({
            user: {
              uid: 'local_user',
              email: null,
              nickname: '크라우디언',
              photoURL: null,
              stats: { ...DEFAULT_STATS },
            },
          })
        }
      },

      // ── Gold ──
      addGold: (amount: number) => {
        const { user } = get()
        if (!user) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              points: Math.max(0, user.stats.points + amount),
            },
          },
        })
      },

      // ── EXP + Level-up ──
      addExp: (amount: number) => {
        const { user } = get()
        if (!user || amount <= 0) return

        let { exp, level, maxExp, stamina, maxStamina } = user.stats
        exp += amount

        // Level-up loop (in case of multi-level jump)
        while (exp >= maxExp) {
          exp -= maxExp
          level += 1
          maxExp = calcMaxExp(level)
          stamina = maxStamina // Reset stamina on level-up
        }

        set({
          user: {
            ...user,
            stats: { ...user.stats, exp, level, maxExp, stamina },
          },
        })
      },

      // ── Stamina ──
      consumeStamina: (amount = STAMINA_PER_MESSAGE) => {
        const { user } = get()
        if (!user) return false
        if (user.stats.stamina < amount) return false

        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              stamina: user.stats.stamina - amount,
            },
          },
        })
        return true
      },

      // ── Trust ──
      addTrust: (delta: number) => {
        const { user } = get()
        if (!user) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              trust: Math.max(0, user.stats.trust + delta),
            },
          },
        })
      },

      // ── Intelligence ──
      addIntelligence: (amount: number) => {
        const { user } = get()
        if (!user || amount <= 0) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              intelligence: user.stats.intelligence + amount,
            },
          },
        })
      },

      // ── Courage ──
      addCourage: (amount: number) => {
        const { user } = get()
        if (!user || amount <= 0) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              courage: user.stats.courage + amount,
            },
          },
        })
      },

      // ── Intimacy ──
      addIntimacy: (amount: number) => {
        const { user } = get()
        if (!user || amount <= 0) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              intimacy: user.stats.intimacy + amount,
            },
          },
        })
      },

      // ── Chat EXP (daily capped at 50) ──
      addChatExp: (amount = EXP_PER_MESSAGE) => {
        const { user, addExp } = get()
        if (!user) return 0

        const remaining = MAX_DAILY_CHAT_EXP - user.stats.dailyChatExp
        if (remaining <= 0) return 0

        const actual = Math.min(amount, remaining)

        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              dailyChatExp: user.stats.dailyChatExp + actual,
            },
          },
        })

        // Also add to total EXP
        addExp(actual)
        return actual
      },

      // ── Daily reset (stamina + dailyChatExp) ──
      resetDaily: () => {
        const { user } = get()
        if (!user) return
        set({
          user: {
            ...user,
            stats: {
              ...user.stats,
              stamina: user.stats.maxStamina,
              dailyChatExp: 0,
            },
          },
        })
      },
    }),
    {
      name: 'user-storage',
    },
  ),
)
