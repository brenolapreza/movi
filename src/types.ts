export type Person = 'breno' | 'leticia';
export type Theme = 'light' | 'dark';
export type Weekday = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary: string[];
  equipment: string;
  difficulty: 'Iniciante' | 'Intermediário';
  sourceUrl: string;
  startingPosture: string;
  execution: string[];
  breathing: string;
  commonMistakes: string[];
  beginnersTips: string[];
  easierAlternative: string;
  substitutes: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  rest: number;
  cue: string;
}

export interface WorkoutDay {
  id: string;
  person: Person;
  title: string;
  label: string;
  objective: string;
  muscleGroups: string[];
  duration: string;
  warmup: string[];
  finish: string;
  safety: string;
  exercises: WorkoutExercise[];
}

export interface ExerciseLog {
  weight: string;
  reps: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  person: Person;
  workoutId: string;
  workoutTitle: string;
  completedExercises: number;
  totalExercises: number;
}

export interface AppState {
  theme: Theme;
  selectedPerson: Person;
  completedExercises: Record<string, boolean>;
  completedWorkouts: Record<string, boolean>;
  exerciseLogs: Record<string, ExerciseLog>;
  notes: Record<string, string>;
  overrides: Record<string, string>;
  history: HistoryEntry[];
  schedule: Record<Person, Weekday[]>;
}

export type AppView = 'home' | 'person' | 'workout' | 'library' | 'history' | 'guide';

