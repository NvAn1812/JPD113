// Toàn bộ hình ảnh vẽ bằng SVG: không cần mạng, không lo link ảnh bị hỏng.
const Win = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width="90" height="80" rx="6" fill="#BFE3F5" stroke="#B98B5E" strokeWidth="5" />
    <line x1={x + 45} y1={y} x2={x + 45} y2={y + 80} stroke="#B98B5E" strokeWidth="4" />
    <circle cx={x + 20} cy={y + 55} r="9" fill="#F9B4CC" /><circle cx={x + 32} cy={y + 46} r="7" fill="#FBC9DB" />
    <circle cx={x + 70} cy={y + 28} r="8" fill="#F9B4CC" />
  </g>
);
const Shoe = ({ x, c }) => (<g><ellipse cx={x} cy="262" rx="30" ry="10" fill={c} /><ellipse cx={x + 8} cy="256" rx="16" ry="8" fill={c} opacity=".8" /></g>);

const SCENES = {
  genkan: (<>
    <rect width="400" height="300" fill="#FBEFE3" />
    <rect x="140" y="25" width="120" height="155" rx="4" fill="#E8C9A0" stroke="#B98B5E" strokeWidth="5" />
    <rect x="156" y="42" width="88" height="62" fill="#BFE3F5" /><circle cx="248" cy="120" r="5" fill="#8B5A2B" />
    <path d="M300 40 L330 40 L336 70 L294 70Z" fill="#F4B6C2" /><rect x="313" y="70" width="4" height="14" fill="#8B5A2B" />
    <rect y="180" width="400" height="9" fill="#D4A574" /><rect y="189" width="400" height="30" fill="#B98B5E" />
    <rect y="219" width="400" height="81" fill="#C9B8A8" />
    <Shoe x={70} c="#6B7A99" /><Shoe x={330} c="#C98A8A" />
  </>),
  living: (<>
    <rect width="400" height="300" fill="#FFF1E0" />
    <Win x={40} y={40} /><rect x="250" y="45" width="100" height="70" fill="#F5D7C3" stroke="#B98B5E" strokeWidth="4" />
    <rect y="200" width="400" height="100" fill="#D9C78A" />
    {[0, 1, 2, 3, 4].map(i => <line key={i} x1={i * 100} y1="200" x2={i * 100 - 30} y2="300" stroke="#C4B070" strokeWidth="2" />)}
    <ellipse cx="90" cy="262" rx="40" ry="14" fill="#F9B4CC" /><ellipse cx="320" cy="262" rx="40" ry="14" fill="#F9B4CC" />
    <rect x="130" y="225" width="140" height="14" rx="5" fill="#8B5A2B" /><rect x="145" y="239" width="10" height="26" fill="#6B4423" /><rect x="245" y="239" width="10" height="26" fill="#6B4423" />
    <rect x="170" y="208" width="26" height="17" rx="4" fill="#fff" /><rect x="212" y="208" width="26" height="17" rx="4" fill="#fff" />
    <rect x="173" y="212" width="20" height="4" fill="#8DBF7A" /><rect x="215" y="212" width="20" height="4" fill="#8DBF7A" />
  </>),
  dining: (<>
    <rect width="400" height="300" fill="#FFF4E6" />
    <line x1="200" y1="0" x2="200" y2="50" stroke="#8B5A2B" strokeWidth="3" /><path d="M165 50 H235 L222 78 H178Z" fill="#F7C873" />
    <rect x="60" y="60" width="80" height="60" rx="4" fill="#fff" stroke="#E7C9A5" strokeWidth="4" /><text x="100" y="98" fontSize="26" textAnchor="middle" fill="#E8809A">和</text>
    <rect y="215" width="400" height="85" fill="#D8B48A" />
    <rect x="50" y="196" width="300" height="20" rx="8" fill="#A06B3B" /><rect x="70" y="216" width="14" height="60" fill="#7F522B" /><rect x="316" y="216" width="14" height="60" fill="#7F522B" />
    {[110, 200, 290].map(x => <g key={x}><ellipse cx={x} cy="192" rx="28" ry="9" fill="#fff" /><path d={`M${x - 28} 190 Q${x} 214 ${x + 28} 190Z`} fill="#F5F0EA" /><ellipse cx={x} cy="190" rx="20" ry="5" fill="#fff" /></g>)}
    <circle cx="200" cy="184" r="6" fill="#E8809A" />
  </>),
  hall: (<>
    <rect width="400" height="300" fill="#F3EEE6" />
    <path d="M0 0 L120 60 V220 L0 300Z" fill="#E9E1D4" /><path d="M400 0 L280 60 V220 L400 300Z" fill="#E9E1D4" />
    <rect x="120" y="60" width="160" height="160" fill="#FAF6EF" />
    <rect x="160" y="85" width="80" height="135" rx="3" fill="#E8C9A0" stroke="#B98B5E" strokeWidth="4" />
    <rect x="178" y="100" width="44" height="22" rx="4" fill="#fff" /><text x="200" y="117" fontSize="15" textAnchor="middle" fill="#6B8FBF" fontWeight="700">WC</text>
    <circle cx="228" cy="165" r="4" fill="#8B5A2B" />
    <path d="M0 300 L120 220 H280 L400 300Z" fill="#C9A173" />
    <rect x="320" y="215" width="26" height="30" rx="4" fill="#C98A8A" /><circle cx="333" cy="205" r="16" fill="#8DBF7A" />
  </>),
};
export const Scene = ({ name }) => (
  <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" aria-hidden="true">{SCENES[name] || SCENES.living}</svg>
);

const LOOK = {
  partner: { hair: '#3B2A33', cloth: '#F9A8C9', label: 'Người yêu' },
  mother: { hair: '#6B5B5B', cloth: '#A7C7E7', label: 'Mẹ người yêu' },
  father: { hair: '#2F2F36', cloth: '#9DB8A0', label: 'Bố người yêu' },
};
export function Char({ who = 'partner', mood = 'idle' }) {
  const c = LOOK[who] || LOOK.partner;
  const happy = mood === 'happy', sad = mood === 'sad';
  const eye = { stroke: '#3B2A33', strokeWidth: 4, fill: 'none', strokeLinecap: 'round' };
  return (
    <svg viewBox="0 0 200 240" className="h-full" role="img" aria-label={`${c.label} (${mood})`}>
      <path d="M25 240 Q32 158 100 158 Q168 158 175 240Z" fill={c.cloth} />
      <path d="M84 158 L100 178 L116 158Z" fill="#fff" />
      <rect x="86" y="138" width="28" height="28" rx="10" fill="#FFE0CC" />
      <ellipse cx="100" cy="92" rx="58" ry="62" fill={c.hair} />
      {who === 'mother' && <circle cx="100" cy="26" r="20" fill={c.hair} />}
      <circle cx="100" cy="102" r="48" fill="#FFE0CC" />
      <path d="M50 96 Q56 42 100 42 Q144 42 150 96 Q126 62 100 68 Q74 62 50 96Z" fill={c.hair} />
      {happy ? (<><path d="M70 104 Q80 92 90 104" {...eye} /><path d="M110 104 Q120 92 130 104" {...eye} /></>) : (<>
        <circle cx="80" cy="104" r="6" fill="#3B2A33" /><circle cx="120" cy="104" r="6" fill="#3B2A33" />
        <circle cx="82" cy="102" r="2" fill="#fff" /><circle cx="122" cy="102" r="2" fill="#fff" /></>)}
      {sad && (<><path d="M68 90 L90 86" {...eye} strokeWidth="3" /><path d="M132 90 L110 86" {...eye} strokeWidth="3" /></>)}
      {who === 'father' && (<g fill="none" stroke="#6B4423" strokeWidth="3"><circle cx="80" cy="104" r="14" /><circle cx="120" cy="104" r="14" /><line x1="94" y1="104" x2="106" y2="104" /></g>)}
      <ellipse cx="64" cy="118" rx="9" ry="6" fill="#FFB6C1" opacity=".65" /><ellipse cx="136" cy="118" rx="9" ry="6" fill="#FFB6C1" opacity=".65" />
      {happy ? <path d="M86 124 Q100 144 114 124Z" fill="#E5586E" /> : sad ? <path d="M90 134 Q100 123 110 134" {...eye} strokeWidth="3" /> : <path d="M90 126 Q100 134 110 126" {...eye} strokeWidth="3" />}
    </svg>
  );
}
export const whoLabel = (w) => (LOOK[w] || LOOK.partner).label;