import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getExerciseMedia } from '../data';
import type { Exercise, ExerciseGif } from '../types';
import { Icon } from './Icon';

interface Props { exercise: Exercise; accent?: 'lime' | 'coral'; compact?: boolean; }

export function ExerciseIllustration({ exercise, accent = 'lime', compact = false }: Props) {
  const [mediaFailed, setMediaFailed] = useState(false);
  const media = getExerciseMedia(exercise.id);
  const primaryGifUrl = media?.gifs[0]?.url;
  useEffect(() => setMediaFailed(false), [exercise.id, primaryGifUrl]);
  const isLower = ['Pernas', 'Posterior', 'Glúteos'].includes(exercise.category);
  const isCore = exercise.category === 'Core';
  const hasGif = Boolean(primaryGifUrl && !mediaFailed);
  return (
    <div className={`exercise-illustration exercise-illustration--${accent} ${compact ? 'is-compact' : ''}`} role="img" aria-label={`Demonstração de ${exercise.name}`}>
      <div className="visual-grid" />
      {hasGif ? <img className="exercise-gif" src={primaryGifUrl} alt={`GIF demonstrativo de ${exercise.name}`} loading={compact ? 'lazy' : 'eager'} decoding="async" onError={() => setMediaFailed(true)} /> : <div className={`visual-person ${isLower ? 'visual-person--lower' : ''} ${isCore ? 'visual-person--core' : ''}`}>
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

interface GalleryProps {
  exercise: Exercise;
  accent?: 'lime' | 'coral';
}

export function ExerciseMediaGallery({ exercise, accent = 'lime' }: GalleryProps) {
  const media = getExerciseMedia(exercise.id);
  const gifs = media?.gifs.slice(0, 2) ?? [];
  const [failedGifs, setFailedGifs] = useState<string[]>([]);
  const [fullscreenGif, setFullscreenGif] = useState<ExerciseGif | null>(null);

  useEffect(() => setFailedGifs([]), [exercise.id]);

  useEffect(() => {
    if (!fullscreenGif) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreenGif(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [fullscreenGif]);

  if (gifs.length < 2) {
    return (
      <div className="media-gallery-fallback">
        <ExerciseIllustration exercise={exercise} accent={accent} />
        <p>As demonstrações extras deste movimento estão sendo preparadas.</p>
      </div>
    );
  }

  const markGifAsFailed = (gif: ExerciseGif) => {
    setFailedGifs((current) => current.includes(gif.url) ? current : [...current, gif.url]);
  };

  return (
    <>
    <section className="media-gallery" aria-label={`Duas demonstrações de ${exercise.name}`}>
      {gifs.map((gif, index) => {
        const hasGif = !failedGifs.includes(gif.url);
        return (
          <figure className="media-gallery__item" key={gif.url}>
            <div className={`media-gallery__visual media-gallery__visual--${accent}`}>
              {hasGif ? <button type="button" className="media-gallery__open" onClick={() => setFullscreenGif(gif)} aria-label={`Abrir ${gif.label} de ${exercise.name} em tela cheia`}><img className="media-gallery__img" src={gif.url} alt={`${gif.label} de ${exercise.name}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" onError={() => markGifAsFailed(gif)} /><span className="media-gallery__hint"><Icon name="maximize" size={13} /> Tocar para ampliar</span></button> : <div className="media-gallery__error"><strong>Demonstração indisponível</strong><span>Use os passos e dicas abaixo como guia.</span></div>}
              <span className="media-gallery__count">{index + 1} / 2</span>
            </div>
            <figcaption className="media-gallery__caption">
              <strong>{gif.label}</strong>
              <small>Fonte: <a href={gif.sourceUrl} target="_blank" rel="noreferrer">{gif.sourceLabel}</a></small>
            </figcaption>
          </figure>
        );
      })}
    </section>
    {fullscreenGif && createPortal(<div className="gif-lightbox" role="presentation" onMouseDown={() => setFullscreenGif(null)}><div className="gif-lightbox__sheet" role="dialog" aria-modal="true" aria-label={`${fullscreenGif.label} de ${exercise.name} em tela cheia`} onMouseDown={(event) => event.stopPropagation()}><div className="gif-lightbox__top"><div><span className="eyebrow">Demonstração ampliada</span><strong>{exercise.name}</strong></div><button type="button" className="icon-button" onClick={() => setFullscreenGif(null)} aria-label="Fechar tela cheia"><Icon name="close" size={20} /></button></div><div className="gif-lightbox__visual"><img src={fullscreenGif.url} alt={`${fullscreenGif.label} de ${exercise.name}`} /></div><div className="gif-lightbox__bottom"><strong>{fullscreenGif.label}</strong><small>Fonte: <a href={fullscreenGif.sourceUrl} target="_blank" rel="noreferrer">{fullscreenGif.sourceLabel}</a></small><span>Toque fora da imagem ou em fechar para voltar</span></div></div></div>, document.body)}
    </>
  );
}
