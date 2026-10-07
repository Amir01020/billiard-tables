import { useId } from 'react';

// Иллюстрация бильярдного стола (вид сверху, наклон задаёт CSS .table3d).
// Используется, пока нет реальных фото.
const POCKETS = [[26, 26], [220, 20], [414, 26], [26, 214], [220, 220], [414, 214]];
const DIAMONDS = [
  ...[1, 2, 3, 5, 6, 7].flatMap((i) => [[26 + i * 48.5, 11], [26 + i * 48.5, 229]]),
  ...[80, 120, 160].flatMap((y) => [[11, y], [429, y]]),
];
const PYRAMID = [];
for (let row = 0; row < 5; row++) {
  for (let i = 0; i <= row; i++) PYRAMID.push([288 + row * 12.6 * 0.87, 120 + (i - row / 2) * 12.6]);
}

export default function TableArt({ wood = '#4a2412', felt = '#0f6b4a', className = '' }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className={`table3d ${className}`} aria-hidden="true">
      <svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={wood} /><stop offset=".5" stopColor={wood} /><stop offset="1" stopColor="#000" stopOpacity=".9" />
          </linearGradient>
          <radialGradient id={`${id}f`} cx=".5" cy=".45" r=".7">
            <stop offset="0" stopColor="#1d8a62" /><stop offset=".55" stopColor={felt} /><stop offset="1" stopColor="#052b1d" />
          </radialGradient>
          <radialGradient id={`${id}b`} cx=".35" cy=".35" r=".7">
            <stop offset="0" stopColor="#fffef8" /><stop offset=".6" stopColor="#ece4cf" /><stop offset="1" stopColor="#9c937c" />
          </radialGradient>
          <radialGradient id={`${id}c`} cx=".35" cy=".35" r=".7">
            <stop offset="0" stopColor="#fff6c8" /><stop offset=".6" stopColor="#e9c96a" /><stop offset="1" stopColor="#8c6d22" />
          </radialGradient>
          <radialGradient id={`${id}l`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="440" height="240" rx="18" fill={`url(#${id}w)`} />
        <rect x="3" y="3" width="434" height="234" rx="16" fill="none" stroke="#fff" strokeOpacity=".12" />
        {DIAMONDS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#e8d6a8" opacity=".8" />)}
        <rect x="20" y="20" width="400" height="200" rx="4" fill="#073d2a" />
        <rect x="28" y="28" width="384" height="184" fill={`url(#${id}f)`} />
        <line x1="122" y1="28" x2="122" y2="212" stroke="#fff" strokeOpacity=".12" />
        <circle cx="122" cy="120" r="2" fill="#fff" opacity=".3" />
        <circle cx="318" cy="120" r="2" fill="#fff" opacity=".3" />
        {POCKETS.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="13" fill="#050505" />
            <circle cx={x} cy={y} r="13" fill="none" stroke="#c9a96a" strokeWidth="2" opacity=".55" />
          </g>
        ))}
        {PYRAMID.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill={`url(#${id}b)`} />)}
        <circle cx="108" cy="132" r="7" fill={`url(#${id}c)`} />
        <ellipse cx="220" cy="110" rx="170" ry="80" fill={`url(#${id}l)`} />
      </svg>
    </div>
  );
}
