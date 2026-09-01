import type { AppState, Person, Theme, Weekday } from './types';

const STORAGE_KEY = 'movi.app-state.v1';

export const defaultState: AppState = {
  theme: 'dark',
  selectedPerson: 'breno',
  completedExercises: {},
  completedWorkouts: {},
  exerciseLogs: {},
  notes: {},
  overrides: {},
  history: [],
  schedule: {
    breno: ['seg', 'ter', 'qui', 'sex'],
    leticia: ['seg', 'ter', 'qui', 'sex'],
  },
};

const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';
const isPerson = (value: unknown): value is Person => value === 'breno' || value === 'leticia';
const isWeekday = (value: unknown): value is Weekday => ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].includes(String(value));

export const loadState = (): AppState => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState,
      ...parsed,
      theme: isTheme(parsed.theme) ? parsed.theme : defaultState.theme,
      selectedPerson: isPerson(parsed.selectedPerson) ? parsed.selectedPerson : defaultState.selectedPerson,
      completedExercises: parsed.completedExercises ?? {},
      completedWorkouts: parsed.completedWorkouts ?? {},
      exerciseLogs: parsed.exerciseLogs ?? {},
      notes: parsed.notes ?? {},
      overrides: parsed.overrides ?? {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      schedule: {
        breno: parsed.schedule?.breno?.filter(isWeekday) ?? defaultState.schedule.breno,
        leticia: parsed.schedule?.leticia?.filter(isWeekday) ?? defaultState.schedule.leticia,
      },
    };
  } catch {
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // O app continua utilizável mesmo quando o navegador bloqueia o armazenamento local.
  }
};

