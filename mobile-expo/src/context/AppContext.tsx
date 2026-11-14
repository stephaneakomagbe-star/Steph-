import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, Profile } from '../data/coursesData';

const STORAGE_KEY = 'faithlingo.progress.v1';
const HEART_RECOVERY_MS = 30 * 60 * 1000;
const MAX_HEARTS = 5;
let saveQueue: Promise<void> = Promise.resolve();

export type AppData = {
  profile: Profile | null;
  completedLessonIds: string[];
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  hearts: number;
  heartRecoveryAt: number;
};

type AppState = AppData & { hydrated: boolean };
type Action =
  | { type: 'hydrate'; data: AppData }
  | { type: 'set-profile'; profile: Profile }
  | { type: 'update-profile'; changes: Partial<Profile> }
  | { type: 'finish-lesson'; lessonId: string; xp: number; studyDate: string; review: boolean }
  | { type: 'lose-heart'; now: number }
  | { type: 'recover-hearts'; now: number };

const INITIAL_DATA: AppData = {
  profile: null,
  completedLessonIds: [],
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  hearts: MAX_HEARTS,
  heartRecoveryAt: 0,
};

const INITIAL_STATE: AppState = { ...INITIAL_DATA, hydrated: false };

function getLocalDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readStoredData(value: string | null): AppData {
  if (!value) return INITIAL_DATA;
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object') throw new Error('Les données enregistrées sont invalides.');
  const saved = parsed as Partial<AppData>;
  const storedProfile = saved.profile;
  const profile = storedProfile ? {
    ...storedProfile,
    reminderHour: Number.isInteger(storedProfile.reminderHour) ? storedProfile.reminderHour : 19,
    reminderMinute: Number.isInteger(storedProfile.reminderMinute) ? storedProfile.reminderMinute : 0,
    hideStreak: storedProfile.hideStreak === true,
  } : null;
  return {
    profile,
    completedLessonIds: Array.isArray(saved.completedLessonIds) ? saved.completedLessonIds : [],
    xp: Number.isFinite(saved.xp) ? Math.max(0, saved.xp as number) : 0,
    streak: Number.isFinite(saved.streak) ? Math.max(0, saved.streak as number) : 0,
    lastStudyDate: typeof saved.lastStudyDate === 'string' ? saved.lastStudyDate : null,
    hearts: Number.isFinite(saved.hearts) ? Math.max(0, Math.min(MAX_HEARTS, saved.hearts as number)) : MAX_HEARTS,
    heartRecoveryAt: Number.isFinite(saved.heartRecoveryAt) ? Math.max(0, saved.heartRecoveryAt as number) : 0,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...action.data, hydrated: true };
    case 'set-profile':
      return { ...state, profile: action.profile };
    case 'update-profile':
      return state.profile ? { ...state, profile: { ...state.profile, ...action.changes } } : state;
    case 'finish-lesson': {
      if (action.review || state.completedLessonIds.includes(action.lessonId)) return state;
      const streak = state.lastStudyDate === action.studyDate
        ? state.streak
        : state.lastStudyDate === getLocalDate(-1)
          ? state.streak + 1
          : 1;
      return {
        ...state,
        completedLessonIds: [...state.completedLessonIds, action.lessonId],
        xp: state.xp + action.xp,
        streak,
        lastStudyDate: action.studyDate,
      };
    }
    case 'lose-heart':
      if (state.hearts <= 0) return state;
      return {
        ...state,
        hearts: state.hearts - 1,
        heartRecoveryAt: state.heartRecoveryAt || (state.hearts === MAX_HEARTS ? action.now : state.heartRecoveryAt),
      };
    case 'recover-hearts': {
      if (state.hearts >= MAX_HEARTS || state.heartRecoveryAt <= 0) return state;
      const intervals = Math.floor((action.now - state.heartRecoveryAt) / HEART_RECOVERY_MS);
      if (intervals <= 0) return state;
      const hearts = Math.min(MAX_HEARTS, state.hearts + intervals);
      return {
        ...state,
        hearts,
        heartRecoveryAt: hearts === MAX_HEARTS ? 0 : state.heartRecoveryAt + intervals * HEART_RECOVERY_MS,
      };
    }
  }
}

type AppContextValue = {
  data: AppData;
  isReady: boolean;
  storageError: string;
  retryStorage: () => void;
  setProfile: (profile: Profile) => void;
  updateProfile: (changes: Partial<Profile>) => void;
  loseHeart: () => void;
  finishLesson: (lesson: Lesson, result: { xp: number; review: boolean }) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [storageError, setStorageError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active) {
          dispatch({ type: 'hydrate', data: readStoredData(value) });
          setStorageError('');
        }
      })
      .catch((error: unknown) => {
        if (active) setStorageError(error instanceof Error ? error.message : 'Impossible de lire la progression enregistrée.');
      });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _hydrated, ...data } = state;
    saveQueue = saveQueue.then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)))
      .then(() => setStorageError(''))
      .catch((error: unknown) => {
        setStorageError(error instanceof Error ? error.message : 'Impossible d’enregistrer la progression.');
      });
  }, [state]);

  useEffect(() => {
    if (!state.hydrated) return;
    const refresh = () => dispatch({ type: 'recover-hearts', now: Date.now() });
    refresh();
    const timer = setInterval(refresh, 30_000);
    return () => clearInterval(timer);
  }, [state.hydrated]);

  const value = useMemo<AppContextValue>(() => ({
    data: {
      profile: state.profile,
      completedLessonIds: state.completedLessonIds,
      xp: state.xp,
      streak: state.streak,
      lastStudyDate: state.lastStudyDate,
      hearts: state.hearts,
      heartRecoveryAt: state.heartRecoveryAt,
    },
    isReady: state.hydrated,
    storageError,
    retryStorage: () => {
      setStorageError('');
      setReloadKey((key) => key + 1);
    },
    setProfile: (profile) => dispatch({ type: 'set-profile', profile }),
    updateProfile: (changes) => dispatch({ type: 'update-profile', changes }),
    loseHeart: () => dispatch({ type: 'lose-heart', now: Date.now() }),
    finishLesson: (lesson, result) => dispatch({
      type: 'finish-lesson',
      lessonId: lesson.id,
      xp: result.xp,
      studyDate: getLocalDate(),
      review: result.review,
    }),
  }), [state, storageError]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useFaithLingo(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useFaithLingo doit être utilisé dans AppProvider.');
  return context;
}
