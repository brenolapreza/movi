import { useEffect, useState } from 'react';
import { getExerciseMedia } from '../data';
import type { Exercise } from '../types';

interface Props { exercise: Exercise; accent?: 'lime' | 'coral'; compact?: boolean; }

export function ExerciseIllustration({ exercise, accent = 'lime', compact = false }: Props) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const media = getExerciseMedia(exercise.id);
  useEffect(() => setMediaFailed(false), [exercise.id, media?.gifUrl]);
  const isLower = ['Pernas', 'Posterior', 'Glúteos'].includes(exercise.category);
  const isCore = exercise.category === 'Core';
  const hasGif = Boolean(media?.gifUrl && !mediaFailed);
  return (
    <div className={`exercise-illustration exercise-illustration--${accent} ${compact ? 'is-compact' : ''}`} role="img" aria-label={`Demonstração de ${exercise.name}`}>
      <div className="visual-grid" />
      {hasGif ? <img className="exercise-gif" src={media?.gifUrl} alt={`GIF demonstrativo de ${exercise.name}`} loading={compact ? 'lazy' : 'eager'} decoding="async" onError={() => setMediaFailed(true)} /> : <div className={`visual-person ${isLower ? 'visual-person--lower' : ''} ${isCore ? 'visual-person--core' : ''}`}>
        <span className="visual-head" />
        <span className="visual-torso" />
        <span className="visual-arm visual-arm--left" />
        <span className="visual-arm visual-arm--right" />
        <span className="visual-leg visual-leg--left" />
        <span className="visual-leg visual-leg--right" />
        <span className="visual-weight visual-weight--left" />
        <span className="visual-weight visual-weight--right" />
      </div>}
      <span className="media-badge">{hasGif ? 'GIF demonstrativo' : 'Ilustração de apoio'}</span>
      <div className="visual-label"><span /> {exercise.category} · {exercise.difficulty}</div>
    </div>
  );
}
