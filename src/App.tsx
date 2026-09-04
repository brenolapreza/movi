import { useEffect, useMemo, useState } from 'react';
import { ExerciseIllustration, ExerciseMediaGallery } from './components/ExerciseIllustration';
import { Icon, type IconName } from './components/Icon';
import { dayLabels, dayNames, exerciseCatalog, formatDate, formatFullDate, getExerciseMedia, getExerciseTeaching, personMeta, weekdayFromDate, workoutPlans } from './data';
import { defaultState, loadState, saveState } from './storage';
import type { AppState, AppView, Exercise, Person, Weekday, WorkoutDay, WorkoutExercise } from './types';

const sessionKey = (person: Person, workoutId: string, exerciseId: string) => `${person}:${workoutId}:${exerciseId}`;
const workoutKey = (person: Person, workoutId: string) => `${person}:${workoutId}`;
const todayKey = () => new Date().toISOString().slice(0, 10);

const navItems: { id: AppView; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'person', label: 'Treinos', icon: 'calendar' },
  { id: 'library', label: 'Exercícios', icon: 'book' },
  { id: 'history', label: 'Histórico', icon: 'chart' },
  { id: 'guide', label: 'Guia', icon: 'info' },
];

interface ExerciseRowProps {
  item: WorkoutExercise;
  workout: WorkoutDay;
  exercise: Exercise;
  index: number;
  isCurrent: boolean;
  done: boolean;
  log: { weight: string; reps: string };
  focusCue: string;
  onOpenExercise: (exerciseId: string) => void;
  onMark: (workout: WorkoutDay, item: WorkoutExercise, completed: boolean) => void;
  onUpdateLog: (workout: WorkoutDay, item: WorkoutExercise, field: 'weight' | 'reps', value: string) => void;
  onStartRest: (seconds: number) => void;
  onSwap: (target: { workout: WorkoutDay; item: WorkoutExercise; exercise: Exercise }) => void;
}

function ExerciseRow({ item, workout, exercise, index, isCurrent, done, log, focusCue, onOpenExercise, onMark, onUpdateLog, onStartRest, onSwap }: ExerciseRowProps) {
  return (
    <article className={`exercise-row ${isCurrent ? 'is-current' : ''} ${done ? 'is-done' : ''}`}>
      <div className="exercise-row__number">{done ? <Icon name="check" size={17} /> : String(index + 1).padStart(2, '0')}</div>
      <div className="exercise-row__body">
        <div className="exercise-row__heading">
          <button className="exercise-name-button" onClick={() => onOpenExercise(exercise.id)}>
            <span className="tag">{exercise.category}</span>
            <h3>{exercise.name}</h3>
            <p>{exercise.equipment}</p>
          </button>
          <button className={`check-btn ${done ? 'is-checked' : ''}`} aria-label={done ? `Desmarcar ${exercise.name}` : `Marcar ${exercise.name} como concluído`} aria-pressed={done} onClick={() => onMark(workout, item, !done)}>
            {done && <Icon name="check" size={18} />}
          </button>
        </div>
        <div className="prescription-row">
          <div><span className="metric-label">Séries</span><strong>{item.sets}</strong></div>
          <div><span className="metric-label">Reps / tempo</span><strong>{item.reps}</strong></div>
          <div><span className="metric-label">Descanso</span><strong>{item.rest}s</strong></div>
        </div>
        <p className="exercise-cue">{item.cue}</p>
        <p className="exercise-focus"><Icon name="sparkle" size={13} /> <span><strong>Foco:</strong> {focusCue}</span></p>
        <div className="log-row">
          <label><span>Carga</span><div className="input-with-suffix"><input type="number" min="0" inputMode="decimal" value={log.weight} onChange={(event) => onUpdateLog(workout, item, 'weight', event.target.value)} placeholder="0" /><em>kg</em></div></label>
          <label><span>Reps feitas</span><input type="number" min="0" inputMode="numeric" value={log.reps} onChange={(event) => onUpdateLog(workout, item, 'reps', event.target.value)} placeholder="—" /></label>
          <button className="timer-button" onClick={() => onStartRest(item.rest)}><Icon name="clock" size={15} /> {item.rest}s</button>
        </div>
        <div className="exercise-actions">
          <button className="text-button" onClick={() => onOpenExercise(exercise.id)}>Ver execução <Icon name="arrow" size={14} /></button>
          <button className="text-button text-button--swap" onClick={() => onSwap({ workout, item, exercise })}><Icon name="swap" size={14} /> Trocar</button>
        </div>
      </div>
    </article>
  );
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<AppView>('home');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [exerciseDetailId, setExerciseDetailId] = useState<string | null>(null);
  const [replacementTarget, setReplacementTarget] = useState<{ workout: WorkoutDay; item: WorkoutExercise; exercise: Exercise } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [restSeconds, setRestSeconds] = useState(0);
  const [restTotal, setRestTotal] = useState(90);
  const [isScheduleEditing, setIsScheduleEditing] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    if (restSeconds <= 0) return undefined;
    const timer = window.setInterval(() => setRestSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [restSeconds]);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => setInstallPrompt(null);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const person = state.selectedPerson;
  const meta = personMeta[person];
  const plan = workoutPlans[person];
  const selectedWorkout = plan.find((workout) => workout.id === selectedWorkoutId) ?? plan[0];
  const selectedExercise = exerciseDetailId ? exerciseCatalog[exerciseDetailId] : null;
  const today = useMemo(() => new Date(), []);

  const setPerson = (nextPerson: Person) => {
    setState((current) => ({ ...current, selectedPerson: nextPerson }));
    setShowProfileMenu(false);
  };

  const openWorkout = (workout: WorkoutDay, nextPerson: Person = person) => {
    setPerson(nextPerson);
    setSelectedWorkoutId(workout.id);
    setView('workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWorkoutExercise = (workout: WorkoutDay, item: WorkoutExercise): Exercise => {
    const override = state.overrides[sessionKey(workout.person, workout.id, item.exerciseId)];
    return exerciseCatalog[override ?? item.exerciseId] ?? exerciseCatalog[item.exerciseId];
  };

  const getTodayWorkout = (forPerson: Person): WorkoutDay | undefined => {
    const weekday = weekdayFromDate(today);
    return workoutPlans[forPerson].find((workout, index) => state.schedule[forPerson][index] === weekday);
  };

  const markExercise = (workout: WorkoutDay, item: WorkoutExercise, completed: boolean) => {
    const key = sessionKey(workout.person, workout.id, item.exerciseId);
    setState((current) => {
      const completedExercises = { ...current.completedExercises, [key]: completed };
      const allCompleted = workout.exercises.every((workoutExercise) => completedExercises[sessionKey(workout.person, workout.id, workoutExercise.exerciseId)]);
      const completedWorkouts = { ...current.completedWorkouts, [workoutKey(workout.person, workout.id)]: allCompleted };
      const historyId = `${todayKey()}:${workout.person}:${workout.id}`;
      const history = allCompleted && !current.history.some((entry) => entry.id === historyId)
        ? [{ id: historyId, date: todayKey(), person: workout.person, workoutId: workout.id, workoutTitle: workout.title, completedExercises: workout.exercises.length, totalExercises: workout.exercises.length }, ...current.history]
        : current.history;
      return { ...current, completedExercises, completedWorkouts, history };
    });
  };

  const markWorkout = (workout: WorkoutDay, completed: boolean) => {
    setState((current) => {
      const completedExercises = { ...current.completedExercises };
      workout.exercises.forEach((item) => { completedExercises[sessionKey(workout.person, workout.id, item.exerciseId)] = completed; });
      const completedWorkouts = { ...current.completedWorkouts, [workoutKey(workout.person, workout.id)]: completed };
      const historyId = `${todayKey()}:${workout.person}:${workout.id}`;
      const history = completed && !current.history.some((entry) => entry.id === historyId)
        ? [{ id: historyId, date: todayKey(), person: workout.person, workoutId: workout.id, workoutTitle: workout.title, completedExercises: workout.exercises.length, totalExercises: workout.exercises.length }, ...current.history]
        : current.history;
      return { ...current, completedExercises, completedWorkouts, history };
    });
  };

  const updateLog = (workout: WorkoutDay, item: WorkoutExercise, field: 'weight' | 'reps', value: string) => {
    const key = sessionKey(workout.person, workout.id, item.exerciseId);
    setState((current) => ({
      ...current,
      exerciseLogs: { ...current.exerciseLogs, [key]: { ...(current.exerciseLogs[key] ?? { weight: '', reps: '' }), [field]: value, updatedAt: new Date().toISOString() } },
    }));
  };

  const updateNote = (workout: WorkoutDay, value: string) => {
    setState((current) => ({ ...current, notes: { ...current.notes, [workoutKey(workout.person, workout.id)]: value } }));
  };

  const replaceExercise = (workout: WorkoutDay, item: WorkoutExercise, replacementId: string) => {
    setState((current) => ({ ...current, overrides: { ...current.overrides, [sessionKey(workout.person, workout.id, item.exerciseId)]: replacementId } }));
    setReplacementTarget(null);
  };

  const updateSchedule = (forPerson: Person, index: number, value: Weekday) => {
    setState((current) => {
      const schedule = { ...current.schedule, [forPerson]: [...current.schedule[forPerson]] };
      schedule[forPerson][index] = value;
      return { ...current, schedule };
    });
  };

  const resetWeek = () => {
    setState((current) => ({ ...current, completedExercises: {}, completedWorkouts: {}, notes: {}, overrides: {} }));
    setShowSettings(false);
  };

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const renderView = () => {
    if (view === 'workout') return renderWorkoutView(selectedWorkout);
    if (view === 'person') return renderPersonView();
    if (view === 'library') return renderLibraryView();
    if (view === 'history') return renderHistoryView();
    if (view === 'guide') return renderGuideView();
    return HomeView();
  };

  function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
    return (
      <div className="page-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {action}
      </div>
    );
  }

  function HomeView() {
    const workout = getTodayWorkout(person);
    const completedCount = plan.filter((item) => state.completedWorkouts[workoutKey(person, item.id)]).length;
    const weekProgress = Math.round((completedCount / plan.length) * 100);
    const nextWorkout = workout ?? plan.find((item) => !state.completedWorkouts[workoutKey(person, item.id)]) ?? plan[0];
    const isTodayWorkout = Boolean(workout);
    return (
      <>
        <section className="welcome-row">
          <div>
            <p className="eyebrow">{formatFullDate(today)}</p>
            <h1>Olá, {meta.name}<span className="title-dot">.</span></h1>
            <p className="welcome-copy">Um treino de cada vez. O seu ritmo também conta.</p>
          </div>
          <div className={`streak-badge streak-badge--${meta.accent}`}><Icon name="flame" size={17} /><span><strong>{state.history.filter((entry) => entry.person === person).length || 0}</strong> treinos registrados</span></div>
        </section>

        <section className={`today-hero today-hero--${meta.accent}`}>
          <div className="today-hero__top"><span className="micro-label"><span className="live-dot" /> {isTodayWorkout ? 'Treino de hoje' : 'Próximo treino'}</span><span className="duration"><Icon name="clock" size={15} /> {nextWorkout.duration}</span></div>
          <div className="today-hero__content">
            <div>
              <p className="hero-day">{isTodayWorkout ? dayLabels[state.schedule[person][plan.indexOf(nextWorkout)]] : 'Em breve'}</p>
              <h2>{nextWorkout.title}</h2>
              <p>{nextWorkout.objective}</p>
              <div className="tag-row">{nextWorkout.muscleGroups.slice(0, 4).map((group) => <span key={group} className="tag tag--dark">{group}</span>)}</div>
            </div>
            <div className="hero-progress-ring" style={{ '--progress': `${workout && state.completedWorkouts[workoutKey(person, workout.id)] ? 100 : 12}%` } as React.CSSProperties}><span>{workout && state.completedWorkouts[workoutKey(person, workout.id)] ? '✓' : `${nextWorkout.exercises.length}`}<small>{workout && state.completedWorkouts[workoutKey(person, workout.id)] ? 'feito' : 'exercícios'}</small></span></div>
          </div>
          <button className="button button--primary button--wide" onClick={() => openWorkout(nextWorkout)}><Icon name="play" size={16} /> {workout && state.completedWorkouts[workoutKey(person, workout.id)] ? 'Revisar treino' : 'Começar treino'} <Icon name="arrow" size={17} /></button>
        </section>

        <section className="section-block">
          <div className="section-title-row"><div><p className="eyebrow">Visão da semana</p><h2>Seu ritmo</h2></div><span className="progress-copy">{completedCount}/{plan.length} concluídos</span></div>
          <div className="progress-line"><span style={{ width: `${weekProgress}%` }} /></div>
          <div className="week-grid">{plan.map((item, index) => <button key={item.id} className={`week-day ${state.completedWorkouts[workoutKey(person, item.id)] ? 'is-done' : ''} ${item.id === workout?.id ? 'is-today' : ''}`} onClick={() => openWorkout(item)}><span>{dayLabels[state.schedule[person][index]]}</span><strong>{state.completedWorkouts[workoutKey(person, item.id)] ? <Icon name="check" size={17} /> : String(index + 1).padStart(2, '0')}</strong><small>{item.label.split(' + ')[0]}</small></button>)}</div>
        </section>

        <section className="insight-grid">
          <button className="insight-card insight-card--lime" onClick={() => setView('guide')}><span className="insight-icon"><Icon name="sparkle" size={20} /></span><span><strong>Progresso simples</strong><small>Aumente a carga só quando a técnica estiver consistente.</small></span><Icon name="arrow" size={16} /></button>
          <button className="insight-card insight-card--blue" onClick={() => setView('library')}><span className="insight-icon"><Icon name="book" size={20} /></span><span><strong>Precisa relembrar?</strong><small>Abra a biblioteca para revisar cada movimento.</small></span><Icon name="arrow" size={16} /></button>
        </section>
      </>
    );
  }

  function renderPersonView() {
    const completedCount = plan.filter((item) => state.completedWorkouts[workoutKey(person, item.id)]).length;
    return (
      <>
        <PageHeading eyebrow="Calendário de treinos" title={`Treinos de ${meta.name}`} description={meta.focus} action={<button className="button button--soft" onClick={() => setShowSettings(true)}><Icon name="settings" size={16} /> Ajustar semana</button>} />
        <section className={`person-banner person-banner--${meta.accent}`}><div className="avatar avatar--large">{meta.avatar}</div><div><span className="micro-label">Foco deste ciclo</span><h2>{completedCount} de {plan.length} sessões concluídas</h2><p>Quatro encontros consistentes formam uma semana completa.</p></div><div className="person-banner__stat"><strong>{Math.round((completedCount / plan.length) * 100)}%</strong><span>semana</span></div></section>
        <div className="priority-row">{(person === 'breno' ? ['Peito', 'Costas', 'Bíceps', 'Pernas'] : ['Pernas', 'Glúteos', 'Posterior', 'Abdômen']).map((item) => <span key={item} className="priority-chip"><span />{item}</span>)}</div>
        <section className="workout-list">{plan.map((item, index) => <WorkoutSummary key={item.id} workout={item} index={index} />)}</section>
        <section className="small-note"><Icon name="info" size={18} /><p>A divisão deixa pelo menos um dia de recuperação entre os blocos e trabalha todos os grupos musculares principais. Em cada sessão, escolha uma das opções de aeróbico ao final.</p></section>
      </>
    );
  }

  function WorkoutSummary({ workout, index }: { workout: WorkoutDay; index: number }) {
    const done = Boolean(state.completedWorkouts[workoutKey(person, workout.id)]);
    return <button className={`workout-summary workout-summary--${meta.accent} ${done ? 'is-done' : ''}`} onClick={() => openWorkout(workout)}><div className="workout-summary__day"><span>{dayLabels[state.schedule[person][index]]}</span><strong>{done ? <Icon name="check" size={18} /> : String(index + 1).padStart(2, '0')}</strong></div><div className="workout-summary__main"><div className="workout-summary__top"><span className="tag">{workout.label}</span><span className="duration"><Icon name="clock" size={14} /> {workout.duration}</span></div><h3>{workout.title}</h3><p>{workout.objective}</p><div className="tag-row">{workout.muscleGroups.map((group) => <span key={group} className="tag tag--muted">{group}</span>)}</div></div><Icon name="arrow" size={18} className="workout-arrow" /></button>;
  }

  function renderWorkoutView(workout: WorkoutDay) {
    const complete = Boolean(state.completedWorkouts[workoutKey(person, workout.id)]);
    const doneCount = workout.exercises.filter((item) => state.completedExercises[sessionKey(person, workout.id, item.exerciseId)]).length;
    const activeIndex = Math.max(0, workout.exercises.findIndex((item) => !state.completedExercises[sessionKey(person, workout.id, item.exerciseId)]));
    return (
      <>
        <button className="back-link" onClick={() => setView('person')}><Icon name="chevron" size={17} className="rotate-90" /> Voltar para treinos</button>
        <section className={`workout-header workout-header--${meta.accent}`}><div className="workout-header__top"><span className="tag tag--dark">{workout.label}</span><span className="duration"><Icon name="clock" size={14} /> {workout.duration}</span></div><h1>{workout.title}</h1><p>{workout.objective}</p><div className="workout-header__bottom"><div className="workout-progress"><div className="progress-line progress-line--light"><span style={{ width: `${(doneCount / workout.exercises.length) * 100}%` }} /></div><span>{doneCount} de {workout.exercises.length} exercícios</span></div><button className="header-complete" onClick={() => markWorkout(workout, !complete)}>{complete ? <><Icon name="check" size={15} /> Concluído</> : 'Concluir treino'}</button></div></section>
        <section className="warmup-card"><div className="warmup-card__icon"><Icon name="flame" size={21} /></div><div><span className="eyebrow">Antes de começar · 6–8 min</span><h2>Acorde o corpo</h2><ul>{workout.warmup.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
        <div className="exercise-section-heading"><div><p className="eyebrow">Sequência recomendada</p><h2>Seu treino</h2></div><span className="small-status"><span className="status-dot" /> {complete ? 'Feito por hoje' : `Próximo: ${activeIndex + 1}`}</span></div>
        <section className="exercise-list">{workout.exercises.map((item, index) => {
          const key = sessionKey(person, workout.id, item.exerciseId);
          const exercise = getWorkoutExercise(workout, item);
          return <ExerciseRow
            key={item.exerciseId}
            item={item}
            workout={workout}
            exercise={exercise}
            index={index}
            isCurrent={index === activeIndex && !complete}
            done={Boolean(state.completedExercises[key])}
            log={state.exerciseLogs[key] ?? { weight: '', reps: '' }}
            focusCue={getExerciseTeaching(exercise).focus}
            onOpenExercise={(exerciseId) => setExerciseDetailId(exerciseId)}
            onMark={markExercise}
            onUpdateLog={updateLog}
            onStartRest={(seconds) => { setRestTotal(seconds); setRestSeconds(seconds); }}
            onSwap={(target) => setReplacementTarget(target)}
          />;
        })}</section>
        <section className={`cardio-card cardio-card--${meta.accent}`}>
          <div className="cardio-card__heading">
            <span className="cardio-card__icon"><Icon name="flame" size={20} /></span>
            <div><span className="eyebrow">Final do treino · escolha 1</span><h2>Aeróbico para fechar</h2></div>
          </div>
          <p className="cardio-card__lead">{person === 'leticia' ? 'Uma opção simples para aumentar o movimento da semana e apoiar o objetivo de emagrecimento.' : 'Uma finalização leve para desenvolver condicionamento sem tirar o foco do treino de força.'}</p>
          <div className="cardio-options">{workout.cardio.map((option, index) => <article className="cardio-option" key={option.name}><div className="cardio-option__top"><span className="cardio-option__number">0{index + 1}</span><div><h3>{option.name}</h3><p>{option.duration} · {option.intensity}</p></div></div><span className="cardio-option__instructions">{option.instructions}</span></article>)}</div>
          <p className="cardio-card__note"><Icon name="info" size={15} /> Faça apenas uma opção. Se estiver muito cansada, reduza o tempo ou encerre com caminhada leve.</p>
        </section>
        <section className="finish-card"><div className="finish-card__top"><span className="finish-icon"><Icon name="check" size={20} /></span><div><span className="eyebrow">Finalização</span><h3>Desacelere com intenção</h3></div></div><p>{workout.finish}</p><div className="safety-inline"><Icon name="info" size={16} /><span>{workout.safety}</span></div></section>
        <section className="notes-card"><div className="section-title-row"><div><p className="eyebrow">Registro rápido</p><h2>Como foi?</h2></div><Icon name="note" size={19} /></div><textarea value={state.notes[workoutKey(person, workout.id)] ?? ''} onChange={(event) => updateNote(workout, event.target.value)} placeholder="Anote sensações, ajustes ou o que quer lembrar…" rows={3} /></section>
        {restSeconds > 0 && <RestTimer />}
      </>
    );
  }

  function RestTimer() {
    const percent = restTotal ? ((restTotal - restSeconds) / restTotal) * 100 : 0;
    return <div className="rest-timer"><div className="rest-timer__ring" style={{ '--progress': `${percent}%` } as React.CSSProperties}><strong>{Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}</strong><small>descanso</small></div><div><span className="eyebrow">Respira. Você está no ritmo.</span><h3>Próxima série em breve</h3><div className="timer-actions"><button className="button button--soft" onClick={() => setRestSeconds((value) => Math.max(0, value - 15))}>−15s</button><button className="button button--primary" onClick={() => setRestSeconds(0)}>Encerrar</button><button className="button button--soft" onClick={() => setRestSeconds((value) => value + 15)}>+15s</button></div></div></div>;
  }

  function renderLibraryView() {
    const exercises = Object.values(exerciseCatalog).filter((exercise) => `${exercise.name} ${exercise.category} ${exercise.primary}`.toLowerCase().includes(libraryQuery.toLowerCase()));
    return <><PageHeading eyebrow="Biblioteca MOVI" title="Aprenda o movimento" description="Fichas curtas para treinar com mais autonomia e menos dúvida." /><div className="search-field"><Icon name="search" size={18} /><input value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="Buscar exercício, músculo ou equipamento" aria-label="Buscar exercício" /></div><div className="library-grid">{exercises.map((exercise) => <button className="library-card" key={exercise.id} onClick={() => setExerciseDetailId(exercise.id)}><ExerciseIllustration exercise={exercise} accent={meta.accent} compact /><div className="library-card__content"><span className="tag">{exercise.category}</span><h3>{exercise.name}</h3><p>{exercise.equipment}</p><span className="library-link">Abrir ficha <Icon name="arrow" size={13} /></span></div></button>)}</div>{exercises.length === 0 && <div className="empty-state"><Icon name="search" size={25} /><h3>Nenhum movimento encontrado</h3><p>Tente buscar por “peito”, “pernas” ou “cabo”.</p></div>}</>;
  }

  function renderHistoryView() {
    const entries = state.history.filter((entry) => entry.person === person);
    const lastSeven = entries.slice(0, 7);
    return <><PageHeading eyebrow="Consistência, não perfeição" title={`Histórico de ${meta.name}`} description="Uma visão simples do que você já colocou em prática." action={<button className="button button--soft" onClick={() => setShowSettings(true)}><Icon name="refresh" size={16} /> Gerenciar dados</button>} /><section className="stats-grid"><div className="stat-card"><span className="stat-card__icon stat-card__icon--lime"><Icon name="trophy" size={18} /></span><strong>{entries.length}</strong><span>treinos registrados</span></div><div className="stat-card"><span className="stat-card__icon stat-card__icon--coral"><Icon name="flame" size={18} /></span><strong>{entries.length ? Math.min(entries.length, 4) : 0}</strong><span>melhor semana</span></div><div className="stat-card"><span className="stat-card__icon stat-card__icon--blue"><Icon name="dumbbell" size={18} /></span><strong>{entries.reduce((sum, entry) => sum + entry.completedExercises, 0)}</strong><span>exercícios feitos</span></div></section><section className="history-panel"><div className="section-title-row"><div><p className="eyebrow">Mais recentes</p><h2>Treinos concluídos</h2></div><span className="history-count">{entries.length} no total</span></div>{lastSeven.length ? <div className="history-list">{lastSeven.map((entry) => <div className="history-item" key={entry.id}><div className="history-date"><strong>{new Date(`${entry.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(new Date(`${entry.date}T12:00:00`)).replace('.', '')}</span></div><div><h3>{entry.workoutTitle}</h3><p>{entry.completedExercises}/{entry.totalExercises} exercícios · {formatDate(new Date(`${entry.date}T12:00:00`))}</p></div><span className="history-check"><Icon name="check" size={15} /></span></div>)}</div> : <div className="empty-state empty-state--small"><Icon name="chart" size={25} /><h3>Seu histórico começa aqui</h3><p>Conclua o primeiro treino para acompanhar a sua consistência.</p></div>}</section></>;
  }

  function renderGuideView() {
    const guideCards = [
      { icon: 'dumbbell' as IconName, title: 'Escolha a carga inicial', text: 'Comece com uma carga leve o bastante para aprender o caminho. As últimas repetições devem exigir atenção, mas sem perder postura ou prender a respiração.' },
      { icon: 'arrow' as IconName, title: 'Quando aumentar', text: 'Quando alcançar o topo da faixa em todas as séries com técnica consistente, aumente pouco: em geral 2–5% e volte para a parte baixa da faixa.' },
      { icon: 'clock' as IconName, title: 'Quanto descansar', text: 'Use 60–90 s em exercícios isolados e até 120 s nos movimentos de pernas e compostos. Se a técnica ainda não voltou, descanse um pouco mais.' },
      { icon: 'sparkle' as IconName, title: 'Por que não falhar sempre', text: 'Treinar até a falha não é necessário para cada série e pode degradar a técnica. Deixe algumas repetições possíveis, principalmente no começo.' },
      { icon: 'info' as IconName, title: 'Dor normal x sinal de alerta', text: 'Cansaço e ardor muscular podem acontecer. Dor aguda, incomum, articular, formigamento ou piora persistente pedem parar e buscar avaliação.' },
      { icon: 'flame' as IconName, title: 'Aquecimento', text: 'Eleve gradualmente a temperatura com 5–7 min de caminhada, bike ou elíptico e faça uma série leve do primeiro movimento.' },
      { icon: 'flame' as IconName, title: 'Aeróbico com constância', text: 'No final de cada sessão, escolha uma opção leve ou moderada. O emagrecimento depende do conjunto da rotina, alimentação, sono e consistência — não de se esgotar em um treino.' },
    ];
    return <><PageHeading eyebrow="Treinar com clareza" title="Guia de bolso" description="O básico para tomar boas decisões durante a semana." /><section className="guide-grid">{guideCards.map((card) => <article className="guide-card" key={card.title}><span className="guide-icon"><Icon name={card.icon} size={20} /></span><h3>{card.title}</h3><p>{card.text}</p></article>)}</section><section className="disclaimer-card"><div className="disclaimer-card__icon"><Icon name="info" size={23} /></div><div><span className="eyebrow">Importante</span><h2>O MOVI é educativo</h2><p>Este aplicativo não substitui avaliação de um profissional de educação física ou médico. Se você tem uma condição de saúde, lesão, está grávida ou sente dor incomum, procure orientação individual antes de treinar.</p></div></section><section className="sources-panel"><div className="section-title-row"><div><p className="eyebrow">Pesquisa registrada</p><h2>Fontes que orientam o app</h2></div><Icon name="external" size={18} /></div><a href="https://odphp.health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf" target="_blank" rel="noreferrer">Physical Activity Guidelines for Americans <Icon name="external" size={14} /></a><a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noreferrer">ACSM · Resistance Training Guidelines 2026 <Icon name="external" size={14} /></a><a href="https://www.who.int/initiatives/behealthy/physical-activity" target="_blank" rel="noreferrer">WHO · Physical activity recommendations <Icon name="external" size={14} /></a><a href="https://www.acefitness.org/resources/everyone/exercise-library/" target="_blank" rel="noreferrer">ACE · Exercise Library <Icon name="external" size={14} /></a></section></>;
  }

  function ExerciseModal({ exercise }: { exercise: Exercise }) {
    const media = getExerciseMedia(exercise.id);
    const teaching = getExerciseTeaching(exercise);
    const alternativeIds = Array.from(new Set([...(exercise.easierId ? [exercise.easierId] : []), ...exercise.substitutes]));
    return <div className="modal-backdrop" role="presentation" onMouseDown={() => setExerciseDetailId(null)}><div className="modal-sheet exercise-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-top"><span className="eyebrow">Ficha do movimento</span><button className="icon-button" onClick={() => setExerciseDetailId(null)} aria-label="Fechar ficha"><Icon name="close" size={20} /></button></div><ExerciseMediaGallery exercise={exercise} accent={meta.accent} /><div className="modal-title-row"><div><span className="tag">{exercise.category}</span><h2 id="exercise-title">{exercise.name}</h2><p>{exercise.primary} · {exercise.equipment}</p></div><span className="difficulty-badge">{exercise.difficulty}</span></div><div className="detail-pills"><span>Principal · {exercise.primary}</span>{exercise.secondary.slice(0, 2).map((item) => <span key={item}>Secundário · {item}</span>)}</div>{media && <section className="media-actions" aria-label="Mídia do exercício"><a className="media-action media-action--youtube" href={media.youtubeUrl} target="_blank" rel="noreferrer"><span className="media-action__icon"><Icon name="play" size={15} /></span><span><strong>Ver vídeo curto no YouTube</strong><small>Busca específica para {exercise.name}</small></span><Icon name="external" size={15} /></a><p className="media-credit"><Icon name="info" size={14} /> Veja as duas demonstrações acima e confirme a execução na fonte técnica. <a href={exercise.sourceUrl} target="_blank" rel="noreferrer">Abrir referência</a></p></section>}<DetailSection title="O que você deve sentir" text={teaching.focus} /><DetailSection title="Pontos para conferir" list={teaching.cues} /><DetailSection title="Postura inicial" text={exercise.startingPosture} /><DetailSection title="Como executar" list={exercise.execution} /><DetailSection title="Respiração" text={exercise.breathing} /><DetailSection title="Erros comuns" list={exercise.commonMistakes} warning /><DetailSection title="Dicas para começar" list={exercise.beginnersTips} /><div className="alternatives-box"><div><span className="eyebrow">Se precisar adaptar</span><p><strong>Mais fácil:</strong> {exercise.easierAlternative}</p><p><strong>Se o equipamento estiver ocupado:</strong> {alternativeIds.map((id) => exerciseCatalog[id]?.name).filter(Boolean).join(' · ')}</p></div><Icon name="swap" size={20} /></div><div className="pain-alert"><Icon name="info" size={17} /><span>Interrompa se houver dor incomum, aguda ou que piora. Busque avaliação se ela persistir.</span></div><a className="source-button" href={exercise.sourceUrl} target="_blank" rel="noreferrer">Abrir referência técnica ACE <Icon name="external" size={15} /></a></div></div>;
  }

  function DetailSection({ title, text, list, warning = false }: { title: string; text?: string; list?: string[]; warning?: boolean }) {
    return <section className={`detail-section ${warning ? 'detail-section--warning' : ''}`}><h3>{title}</h3>{text && <p>{text}</p>}{list && <ul>{list.map((item) => <li key={item}>{item}</li>)}</ul>}</section>;
  }

  function ReplaceModal({ target }: { target: { workout: WorkoutDay; item: WorkoutExercise; exercise: Exercise } }) {
    const optionIds = Array.from(new Set([...(target.exercise.easierId ? [target.exercise.easierId] : []), ...target.exercise.substitutes]));
    const options = optionIds.map((id) => exerciseCatalog[id]).filter((option): option is Exercise => Boolean(option));
    return <div className="modal-backdrop" role="presentation" onMouseDown={() => setReplacementTarget(null)}><div className="modal-sheet replace-modal" role="dialog" aria-modal="true" aria-labelledby="replace-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-top"><div><span className="eyebrow">Adaptar sem perder o foco</span><h2 id="replace-title">Trocar exercício</h2></div><button className="icon-button" onClick={() => setReplacementTarget(null)} aria-label="Fechar"><Icon name="close" size={20} /></button></div><p className="modal-lead">Escolha uma alternativa para <strong>{target.exercise.name}</strong>. As opções abaixo mantêm o objetivo do movimento, e a troca fica ligada a esta etapa do treino.</p><div className="replacement-options">{options.map((option) => <button key={option.id} className="replacement-option" onClick={() => replaceExercise(target.workout, target.item, option.id)}><div><div className="replacement-option__labels"><span className="tag">{option.category}</span>{option.id === target.exercise.easierId && <span className="swap-badge">Mais fácil</span>}</div><h3>{option.name}</h3><p>{option.equipment}</p></div><Icon name="arrow" size={17} /></button>)}</div>{options.length === 0 && <div className="empty-state empty-state--small"><Icon name="swap" size={25} /><h3>Sem troca cadastrada</h3><p>Use a orientação da ficha ou peça ajuda na academia.</p></div>}</div></div>;
  }

  function SettingsModal() {
    const weekdays: Weekday[] = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
    return <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowSettings(false)}><div className="modal-sheet settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-top"><div><span className="eyebrow">Preferências</span><h2 id="settings-title">Ajustar MOVI</h2></div><button className="icon-button" onClick={() => setShowSettings(false)} aria-label="Fechar"><Icon name="close" size={20} /></button></div><div className="settings-block"><div><h3>Aparência</h3><p>Escolha o modo que funciona melhor na academia.</p></div><button className="theme-toggle" onClick={() => setState((current) => ({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' }))}><span><Icon name={state.theme === 'dark' ? 'moon' : 'sun'} size={16} /> {state.theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</span><span className="toggle-track"><span /></span></button></div><div className="settings-install"><div className="settings-install__copy"><span className="settings-install__icon"><Icon name="download" size={17} /></span><div><h3>Usar como aplicativo</h3><p>{installPrompt ? 'Instale o MOVI na tela inicial para abrir mais rápido.' : 'No celular, use o menu do navegador e escolha “Adicionar à tela de início”.'}</p></div></div>{installPrompt && <button className="button button--primary" onClick={installApp}>Instalar</button>}</div><div className="settings-block settings-block--column"><div className="settings-heading"><div><h3>Editar dias da semana</h3><p>Os treinos seguem a ordem abaixo.</p></div><button className="text-button" onClick={() => setIsScheduleEditing((value) => !value)}>{isScheduleEditing ? 'Concluir edição' : 'Editar'}</button></div>{isScheduleEditing && <div className="schedule-editor">{(['breno', 'leticia'] as Person[]).map((forPerson) => <div key={forPerson} className="schedule-person"><span className="schedule-person-name">{personMeta[forPerson].name}</span>{workoutPlans[forPerson].map((workout, index) => <label key={workout.id}><span>{workout.title}</span><select value={state.schedule[forPerson][index]} onChange={(event) => updateSchedule(forPerson, index, event.target.value as Weekday)}>{weekdays.map((weekday) => <option key={weekday} value={weekday}>{dayNames[weekday]}</option>)}</select></label>)}</div>)}</div>}</div><div className="settings-danger"><div><h3>Reiniciar semana</h3><p>Apaga marcações, notas e trocas desta semana.</p></div><button className="button button--danger" onClick={() => { if (window.confirm('Reiniciar o progresso da semana?')) resetWeek(); }}>Reiniciar</button></div></div></div>;
  }

  return <div className={`app-shell app-shell--${meta.accent}`}><aside className="sidebar"><div className="brand"><span className="brand-mark"><span /><span /><span /></span><span>MOVI</span></div><p className="brand-tagline">nosso ritmo, <em>em movimento.</em></p><nav className="desktop-nav" aria-label="Navegação principal">{navItems.map((item) => <button key={item.id} className={view === item.id || (item.id === 'person' && view === 'workout') ? 'is-active' : ''} onClick={() => { setView(item.id); if (item.id === 'person') setSelectedWorkoutId(null); }}><Icon name={item.icon} size={19} /><span>{item.label}</span>{item.id === 'person' && <span className="nav-person-dot" />}</button>)}</nav><div className="sidebar-bottom"><button className="settings-link" onClick={() => setShowSettings(true)}><Icon name="settings" size={18} /> Configurações</button><div className="mini-disclaimer">feito para começar<br /><strong>com calma.</strong></div></div></aside><main className="main-content"><header className="topbar"><div className="mobile-brand"><span className="brand-mark"><span /><span /><span /></span><strong>MOVI</strong></div><div className="topbar-actions"><div className="profile-switcher"><button className="profile-trigger" onClick={() => setShowProfileMenu((value) => !value)}><span className={`avatar avatar--${meta.accent}`}>{meta.avatar}</span><span className="profile-trigger__copy"><small>Treino de</small><strong>{meta.name}</strong></span><Icon name="chevron" size={15} /></button>{showProfileMenu && <div className="profile-menu"><span className="menu-label">Trocar perfil</span>{(['breno', 'leticia'] as Person[]).map((profile) => <button key={profile} onClick={() => setPerson(profile)} className={profile === person ? 'is-selected' : ''}><span className={`avatar avatar--${personMeta[profile].accent}`}>{personMeta[profile].avatar}</span><span>{personMeta[profile].name}</span>{profile === person && <Icon name="check" size={15} />}</button>)}</div>}</div><button className="icon-button topbar-settings" onClick={() => setShowSettings(true)} aria-label="Abrir configurações"><Icon name="settings" size={19} /></button></div></header><div className="page-content">{renderView()}</div></main><nav className="mobile-nav" aria-label="Navegação mobile">{navItems.slice(0, 4).map((item) => <button key={item.id} className={view === item.id || (item.id === 'person' && view === 'workout') ? 'is-active' : ''} onClick={() => { setView(item.id); if (item.id === 'person') setSelectedWorkoutId(null); }}><Icon name={item.icon} size={20} /><span>{item.label}</span></button>)}</nav>{selectedExercise && <ExerciseModal exercise={selectedExercise} />}{replacementTarget && <ReplaceModal target={replacementTarget} />}{showSettings && <SettingsModal />}</div>;
}

export default App;
