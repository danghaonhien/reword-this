import { 
  UnlockableTone, 
  Theme, 
  ToneMasterBadge, 
  DailyMission,
  GameificationResult 
} from '../hooks/gameificationTypes';

export interface GameificationState {
  xp: number;
  level: number;
  streak: number;
  lastRewriteDate: string | null;
  lastStreakUpdateDay: string | null;
  unlockableTones: UnlockableTone[];
  themes: Theme[];
  toneMasterBadges: ToneMasterBadge[];
  dailyMissions: DailyMission[];
  tonesUsedToday: string[];
  activeBadge: string | null;
}

export type GameificationEventType = 
  | 'xp_update'
  | 'level_update'
  | 'streak_update'
  | 'tone_unlock'
  | 'theme_unlock'
  | 'badge_unlock'
  | 'mission_update'
  | 'active_badge_update';

export class GameificationService {
  private state: GameificationState;

  constructor() {
    this.state = {
      xp: 0,
      level: 1,
      streak: 0,
      lastRewriteDate: null,
      lastStreakUpdateDay: null,
      unlockableTones: [],
      themes: [],
      toneMasterBadges: [],
      dailyMissions: [],
      tonesUsedToday: [],
      activeBadge: null
    };
    this.loadState();
  }

  private loadState() {
    const savedState = localStorage.getItem('gameification_state');
    if (savedState) {
      this.state = { ...this.state, ...JSON.parse(savedState) };
    }
    this.checkDailyReset();
  }

  private saveState() {
    localStorage.setItem('gameification_state', JSON.stringify(this.state));
  }

  private dispatchEvent(type: GameificationEventType, detail: any) {
    const event = new CustomEvent(type, { detail });
    window.dispatchEvent(event);
  }

  private checkDailyReset() {
    const today = new Date().toISOString().split('T')[0];
    const lastUpdate = this.state.lastStreakUpdateDay;
    
    if (lastUpdate !== today) {
      this.resetDailyMissions();
      this.state.tonesUsedToday = [];
      this.state.lastStreakUpdateDay = today;
      this.saveState();
    }
  }

  private resetDailyMissions() {
    this.state.dailyMissions = this.state.dailyMissions.map(mission => ({
      ...mission,
      completed: false,
      progress: 0
    }));
  }

  private checkLevelUp() {
    const xpForNextLevel = this.state.level * 100;
    if (this.state.xp >= xpForNextLevel) {
      this.state.level++;
      this.state.xp -= xpForNextLevel;
      this.dispatchEvent('level_update', this.state.level);
      this.checkUnlocks();
    }
  }

  private checkUnlocks() {
    // Check for unlockable tones
    this.state.unlockableTones.forEach(tone => {
      if (!tone.unlocked && tone.unlockRequirement.type === 'xp' && this.state.xp >= tone.unlockRequirement.value) {
        tone.unlocked = true;
        this.dispatchEvent('tone_unlock', tone);
      }
    });

    // Check for themes
    this.state.themes.forEach(theme => {
      if (!theme.unlocked && theme.unlockRequirement.type === 'level' && this.state.level >= theme.unlockRequirement.value) {
        theme.unlocked = true;
        this.dispatchEvent('theme_unlock', theme);
      }
    });
  }

  public getState(): GameificationState {
    return { ...this.state };
  }

  public addXP(amount: number) {
    this.state.xp += amount;
    this.dispatchEvent('xp_update', this.state.xp);
    this.checkLevelUp();
    this.saveState();
  }

  public updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (this.state.lastRewriteDate !== today) {
      this.state.streak++;
      this.state.lastRewriteDate = today;
      this.dispatchEvent('streak_update', this.state.streak);
      this.saveState();
    }
  }

  public trackToneUsage(toneId: string, wordCount: number) {
    if (!this.state.tonesUsedToday.includes(toneId)) {
      this.state.tonesUsedToday.push(toneId);
      
      // Update badges
      this.state.toneMasterBadges.forEach(badge => {
        if (!badge.unlocked && badge.tone === toneId) {
          badge.progress++;
          if (badge.progress >= badge.required) {
            badge.unlocked = true;
            this.dispatchEvent('badge_unlock', badge);
          }
        }
      });

      // Update missions
      const toneMission = this.state.dailyMissions.find(m => m.type === 'use_tones');
      if (toneMission && !toneMission.completed) {
        toneMission.progress = Math.min(toneMission.progress + 1, toneMission.goal);
        if (toneMission.progress >= toneMission.goal) {
          toneMission.completed = true;
          if (toneMission.reward.type === 'xp') {
            this.addXP(toneMission.reward.value);
          }
        }
        this.dispatchEvent('mission_update', toneMission);
        this.saveState();
      }
    }
  }

  public updateMissions(type: 'use_tones' | 'rewrite_words' | 'rewrite_count' | 'battle' | 'custom_tone', progress: number) {
    const mission = this.state.dailyMissions.find(m => m.type === type);

    if (mission && !mission.completed) {
      mission.progress = Math.min(mission.progress + 1, mission.goal);
      if (mission.progress >= mission.goal) {
        mission.completed = true;
        if (mission.reward.type === 'xp') {
          this.addXP(mission.reward.value);
        }
      }
      this.dispatchEvent('mission_update', mission);
      this.saveState();
    }
  }

  public setActiveBadge(badgeId: string | null) {
    this.state.activeBadge = badgeId;
    this.dispatchEvent('active_badge_update', badgeId);
    this.saveState();
  }
}

export const gameificationService = new GameificationService(); 