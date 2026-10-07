const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" {...S} strokeWidth={1.8} />,
  sliders: (
    <g {...S}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
      <circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" />
    </g>
  ),
  layout: <g {...S}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 10h18M10 10v11" /></g>,
  truck: (
    <g {...S}>
      <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" />
      <circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" />
    </g>
  ),
  shield: <g {...S}><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></g>,
  award: <g {...S}><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 21l5-2.5 5 2.5-1.5-7" /></g>,
  factory: <g {...S}><path d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17z" /><path d="M7 17h2M12 17h2M17 17h1" /></g>,
  support: (
    <g {...S}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19c0 1.5-2 2-5 2" />
    </g>
  ),
  check: <g {...S}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" strokeWidth={1.8} /></g>,
  camera: <g {...S} strokeWidth={1.5}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></g>,
  ruler: <g {...S}><path d="m3 17 14-14 4 4L7 21z" /><path d="m7 13 2 2M10 10l2 2M13 7l2 2" /></g>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" {...S} />,
  file: <g {...S}><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></g>,
  clip: <path d="m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7" {...S} />,
  // широкие иконки
  table: { vb: '0 0 48 24', el: <g {...S}><path d="M4 6h40l-3 7H7z" /><path d="M9 13v8M39 13v8M7 13h34" /></g> },
  tower: { vb: '0 0 24 24', el: <g {...S}><path d="M9 21 12 3l3 18M7 7h10M5 11h14M10 14h4M9.5 17h5" /></g> },
};

export default function Icon({ name, className = '' }) {
  const icon = ICONS[name];
  const vb = icon?.vb || '0 0 24 24';
  return (
    <svg className={`icon ${className}`} viewBox={vb} aria-hidden="true">
      {icon?.el || icon}
    </svg>
  );
}
