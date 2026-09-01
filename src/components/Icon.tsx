import type { SVGProps } from 'react';

export type IconName = 'home' | 'calendar' | 'book' | 'chart' | 'info' | 'settings' | 'play' | 'check' | 'arrow' | 'clock' | 'swap' | 'close' | 'plus' | 'minus' | 'sun' | 'moon' | 'chevron' | 'trophy' | 'flame' | 'note' | 'external' | 'search' | 'refresh' | 'sparkle' | 'dumbbell';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconName, JSX.Element> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M7 2.5v4M17 2.5v4M3 9h18" /><path d="M7 13h.01M11 13h.01M15 13h.01M7 17h.01M11 17h.01" /></>,
    book: <><path d="M4 5.5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 1-2-2z" /><path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 0 2-2z" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 3-4 3 2 5-7" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    settings: <><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /><circle cx="12" cy="12" r="4" /></>,
    play: <path d="m9 6 9 6-9 6z" fill="currentColor" stroke="none" />,
    check: <path d="m5 12 4.2 4.2L19 6.5" />,
    arrow: <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    swap: <><path d="M4 7h14" /><path d="m15 4 3 3-3 3" /><path d="M20 17H6" /><path d="m9 14-3 3 3 3" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    sun: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></>,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4 8 8 0 1 0 20 15.2z" />,
    chevron: <path d="m7 9 5 5 5-5" />,
    trophy: <><path d="M8 5h8v4a4 4 0 0 1-8 0z" /><path d="M8 7H5v1a3 3 0 0 0 3 3M16 7h3v1a3 3 0 0 1-3 3M12 13v4M8 20h8M9 17h6" /></>,
    flame: <path d="M12 21a6 6 0 0 0 6-6c0-4-3-5-4-9-2 1-3 3-3 5-2-1-3-3-3-5-2 2-3 5-3 8a7 7 0 0 0 7 7z" />,
    note: <><path d="M5 3h14v18H5z" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.7-4L3 10" /><path d="M3 5v5h5M4 13a8 8 0 0 0 14.7 4L21 14" /><path d="M21 19v-5h-5" /></>,
    sparkle: <><path d="m12 3 1.1 4.2L17 9l-3.9 1.8L12 15l-1.1-4.2L7 9l3.9-1.8z" /><path d="m19 14 .5 1.8L21 17l-1.5.7L19 20l-.5-2.3L17 17l1.5-1.2z" /></>,
    dumbbell: <><path d="M6 8v8M3.5 10v4M18 8v8M20.5 10v4M6 12h12" /></>,
  };

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...common} {...props}>{paths[name]}</svg>;
}

