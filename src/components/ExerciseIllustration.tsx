import type { Exercise } from '../types';

interface Props { exercise: Exercise; accent?: 'lime' | 'coral'; compact?: boolean; }

export function ExerciseIllustration({ exercise, accent = 'lime', compact = false }: Props) {
  const isLower = ['Pernas', 'Posterior', 'Glúteos'].includes(exercise.category);
  const isCore = exercise.category === 'Core';
  return (
    <div className={`exercise-illustration exercise-illustration--${accent} ${compact ? 'is-compact' : ''}`} role="img" aria-label={`Ilustração de ${exercise.name}`}>
      <div className="visual-grid" />
      <div className={`visual-person ${isLower ? 'visual-person--lower' : ''} ${isCore ? 'visual-person--core' : ''}`}>
        <span className="visual-head" />
        <span className="visual-torso" />
        <span className="visual-arm visual-arm--left" />
        <span className="visual-arm visual-arm--right" />
        <span className="visual-leg visual-leg--left" />
        <span className="visual-leg visual-leg--right" />
        <span className="visual-weight visual-weight--left" />
        <span className="visual-weight visual-weight--right" />
      </div>
      <div className="visual-label"><span /> {exercise.category} · {exercise.difficulty}</div>
    </div>
  );
}

