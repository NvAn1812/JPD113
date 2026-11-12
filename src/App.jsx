import { useState, useEffect } from 'react';
import { Heart, Play, BookOpen, Settings, CheckCircle2, XCircle, ChevronRight, RotateCcw, Home, Award, Volume2, ArrowLeft } from 'lucide-react';
import { GAME_DATA, META, VOCAB_UNITS } from './data.js';
import { Scene, Char, whoLabel } from './art.jsx';

const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* bỏ qua */ } },
};
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
// Xáo thứ tự đáp án mỗi lượt chơi để không đoán theo vị trí
const makeDeck = () => GAME_DATA.map((q) => ({ ...q, options: shuffle(q.options).map((o, i) => ({ ...o, id: 'ABCD'[i] })) }));
const speak = (t) => {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(t.replace(/[「」（）()]/g, '')); u.lang = 'ja-JP'; u.rate = 0.9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
};
const btn = 'font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors';

const Toggle = ({ label, on, set }) => (
  <button onClick={() => set(!on)} role="switch" aria-checked={on} className="w-full flex items-center justify-between bg-pastel-beige rounded-2xl px-4 py-3 font-semibold text-gray-700">
    {label}<span className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? 'bg-pink-400' : 'bg-gray-300'}`}><span className={`block w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} /></span>
  </button>
);

const Shell = ({ title, onBack, children }) => (
  <div className="min-h-screen bg-pastel-pink flex flex-col items-center p-4">
    <div className="w-full max-w-3xl">
      <button onClick={onBack} className={`${btn} bg-white text-pink-600 px-4 py-2 mb-4 shadow-sm`}><ArrowLeft size={18} /> Trang chủ</button>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">{title}</h2>{children}
    </div>
  </div>
);

// Thẻ từ vựng: [Hán Việt, Kanji, Hiragana, Nghĩa]
const VocabCard = ({ w, hide }) => {
  const [open, setOpen] = useState(false);
  const [hv, kanji, kana, vi] = w;
  const covered = hide && !open;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col gap-1">
      <div className="flex items-start justify-between gap-2">
        <div className="jp text-3xl font-bold text-gray-800 leading-tight">{kanji}</div>
        <button onClick={() => speak(kana.split('・')[0])} aria-label={`Nghe ${kana}`} className="p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 shrink-0"><Volume2 size={18} /></button>
      </div>
      <div className="jp text-pink-500 font-semibold">{kana}</div>
      <button onClick={() => setOpen(!open)} className={`text-left transition ${covered ? 'blur-sm select-none' : ''}`} aria-label={covered ? 'Hiện nghĩa' : 'Nghĩa của từ'}>
        <span className="inline-block bg-amber-100 text-pastel-brown text-xs font-bold px-2 py-0.5 rounded-full mb-1">{hv}</span>
        <div className="text-sm text-gray-600">{vi}</div>
      </button>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('start');
  const [deck, setDeck] = useState(GAME_DATA);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [picked, setPicked] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [high, setHigh] = useState(() => store.get('japaneseGameHighScore', 0));
  const [sound, setSound] = useState(() => store.get('jp_sound', true));
  const [showVi, setShowVi] = useState(() => store.get('jp_showVi', true));
  const [unit, setUnit] = useState(0);
  const [hide, setHide] = useState(false);

  const q = deck[i];
  const home = () => setScreen('start');
  useEffect(() => { if (screen === 'play' && sound) speak(q.dialogue); }, [screen, i]); // eslint-disable-line

  const start = () => { setDeck(makeDeck()); setI(0); setScore(0); setCombo(0); setPicked(null); setWrong([]); setScreen('play'); };
  const choose = (o) => {
    if (picked) return;
    setPicked(o);
    if (o.isCorrect) { setScore((s) => s + 100 + combo * 10); setCombo((c) => c + 1); }
    else { setCombo(0); setWrong((w) => [...w, { q, o }]); }
  };
  const next = () => {
    if (i < deck.length - 1) { setI(i + 1); setPicked(null); return; }
    if (score > high) { setHigh(score); store.set('japaneseGameHighScore', score); }
    setScreen('result');
  };
  const setS = (k, fn) => (v) => { fn(v); store.set(k, v); };

  // --- TỪ VỰNG HÁN TỰ ---
  if (screen === 'vocab') return (
    <Shell title="Từ vựng Hán tự" onBack={home}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {VOCAB_UNITS.map((u, n) => (
          <button key={u.unit} onClick={() => setUnit(n)} className={`${btn} px-4 py-2 text-sm ${unit === n ? 'bg-pink-400 text-white' : 'bg-white text-pink-600 border border-pink-100'}`}>{u.unit} ({u.words.length})</button>
        ))}
        <button onClick={() => setHide(!hide)} aria-pressed={hide} className={`${btn} px-4 py-2 text-sm ml-auto ${hide ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>{hide ? 'Đang ẩn nghĩa' : 'Ẩn nghĩa để tự kiểm tra'}</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {VOCAB_UNITS[unit].words.map((w) => <VocabCard key={unit + w[1] + w[2]} w={w} hide={hide} />)}
      </div>
    </Shell>
  );

  // --- CÀI ĐẶT ---
  if (screen === 'settings') return (
    <Shell title="Cài đặt" onBack={home}>
      <div className="flex flex-col gap-3 max-w-md">
        <Toggle label="Tự động đọc câu thoại" on={sound} set={setS('jp_sound', setSound)} />
        <Toggle label="Hiện bản dịch tiếng Việt" on={showVi} set={setS('jp_showVi', setShowVi)} />
        <button onClick={() => { setHigh(0); store.set('japaneseGameHighScore', 0); }} className={`${btn} bg-gray-100 hover:bg-gray-200 text-gray-700 py-3`}>Xóa kỷ lục ({high})</button>
      </div>
    </Shell>
  );

  // --- MÀN HÌNH BẮT ĐẦU ---
  if (screen === 'start') return (
    <div className="min-h-screen bg-pastel-pink flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 text-pink-300 opacity-50 animate-bounce"><Heart size={48} /></div>
      <div className="absolute bottom-20 right-10 text-pink-300 opacity-50 animate-pulse"><Heart size={64} /></div>
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100 text-center max-w-lg w-full z-10 overflow-hidden">
        <div className="relative h-44 bg-pink-50"><Scene name="living" /><div className="absolute bottom-0 inset-x-0 h-36 flex justify-center gap-2"><Char who="mother" mood="happy" /><Char who="partner" mood="happy" /><Char who="father" mood="happy" /></div></div>
        <div className="p-8">
          <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-4">日本語学習ゲーム</div>
          <h1 className="jp text-4xl font-extrabold text-gray-800 mb-2">初めて恋人の家へ</h1>
          <h2 className="text-lg text-gray-500 mb-2 font-semibold">My First Visit to My Japanese Lover's Home</h2>
          <p className="text-sm text-pink-500 font-bold mb-6">Kỷ lục: {high}</p>
          <div className="flex flex-col gap-4">
            <button onClick={start} className={`${btn} w-full bg-pink-400 hover:bg-pink-500 text-white py-4 shadow-lg shadow-pink-200`}><Play fill="currentColor" /> Bắt đầu ngay</button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setScreen('vocab')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><BookOpen size={18} /> Từ vựng</button>
              <button onClick={() => setScreen('settings')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><Settings size={18} /> Cài đặt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- KẾT QUẢ ---
  if (screen === 'result') {
    const acc = (deck.length - wrong.length) / deck.length;
    const r = acc === 1 ? ['S', 'text-yellow-500', 'Tuyệt vời! Gia đình người yêu rất ấn tượng về bạn!']
      : acc >= 0.8 ? ['A', 'text-pink-500', 'Rất tốt! Bạn giao tiếp tiếng Nhật khá tự nhiên.']
      : acc >= 0.5 ? ['B', 'text-blue-500', 'Khá ổn! Hãy luyện tập thêm để tự tin hơn nhé.']
      : ['C', 'text-gray-500', 'Cố lên! Bạn cần ôn lại văn hóa giao tiếp Nhật Bản.'];
    return (
      <div className="min-h-screen bg-pastel-beige flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border-t-8 border-pink-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết quả chuyến thăm!</h2>
          <div className="h-32 flex justify-center mb-2"><Char who="partner" mood={acc >= 0.5 ? 'happy' : 'sad'} /></div>
          <div className="relative inline-block mb-4"><div className={`text-7xl font-black ${r[1]} animate-pop`}>{r[0]}</div><Award size={36} className="absolute -top-3 -right-8 text-yellow-400" /></div>
          <p className="text-gray-600 mb-6 font-medium">{r[2]}</p>
          <div className="bg-pink-50 rounded-2xl p-4 mb-6 text-left">
            {[['Tổng điểm', score, 'text-pink-600'], ['Kỷ lục', high, 'text-gray-700'], ['Trả lời đúng', `${deck.length - wrong.length} / ${deck.length}`, 'text-green-500']].map(([k, v, c]) => (
              <div key={k} className="flex justify-between items-center py-1"><span className="text-gray-500">{k}:</span><span className={`text-lg font-bold ${c}`}>{v}</span></div>))}
          </div>
          {wrong.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Cần ôn lại ({wrong.length})</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {wrong.map(({ q: w, o }) => (
                  <li key={w.id} className="text-sm bg-red-50 rounded-xl p-3">
                    <div className="text-gray-500">{w.situation}</div>
                    <div className="jp text-red-500 line-through">{o.text}</div>
                    <div className="jp text-green-600 font-bold">{w.options.find((x) => x.isCorrect).text}</div>
                  </li>))}
              </ul>
            </div>)}
          <div className="flex gap-4">
            <button onClick={start} className={`${btn} flex-1 bg-pink-400 hover:bg-pink-500 text-white py-3`}><RotateCcw size={18} /> Chơi lại</button>
            <button onClick={home} className={`${btn} flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3`}><Home size={18} /> Trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHƠI ---
  const m = META[q.id] || { scene: 'living', who: 'partner' };
  const mood = !picked ? 'idle' : picked.isCorrect ? 'happy' : 'sad';
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="w-full max-w-4xl h-[100dvh] sm:h-[800px] sm:max-h-[95vh] bg-pastel-rose relative overflow-hidden sm:rounded-3xl shadow-2xl flex flex-col">
        <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/40 to-transparent p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-pink-600 shadow">Điểm: {score}</div>
              {combo > 1 && <div className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow animate-pulse">Combo x{combo}!</div>}
            </div>
            <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-600">{i + 1} / {deck.length}</div>
          </div>
          <div className="mt-3 h-2 bg-white/40 rounded-full overflow-hidden"><div className="h-full bg-pink-400 transition-all" style={{ width: `${((i + (picked ? 1 : 0)) / deck.length) * 100}%` }} /></div>
        </div>

        <div className="flex-1 relative min-h-[220px] overflow-hidden bg-pink-50">
          <Scene name={m.scene} />
          <div className="absolute top-20 inset-x-0 flex justify-center z-20"><span className="bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-pink-100 text-pink-500 font-bold">Bối cảnh: {q.situation}</span></div>
          <div className="absolute bottom-0 inset-x-0 h-[78%] flex justify-center z-10 drop-shadow-xl"><Char who={m.who} mood={mood} /></div>
        </div>

        <div className="w-full z-30 flex flex-col bg-white relative max-h-[58%] sm:max-h-[55%]">
          <div className="mx-4 -mt-10 mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-pink-200 p-5 relative z-40">
            <div className="absolute -top-4 left-4 bg-pink-500 text-white px-5 py-1 rounded-full font-bold text-sm shadow-md">{q.speaker}</div>
            <button onClick={() => speak(q.dialogue)} aria-label="Nghe lại câu thoại" className="absolute top-3 right-3 p-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200"><Volume2 size={18} /></button>
            <p className="jp text-xl font-bold text-gray-800 mt-2 mb-1 tracking-wide pr-10">{q.dialogue}</p>
            {showVi && <p className="text-gray-500 text-sm italic">{q.translate}</p>}
          </div>
          <div className="px-4 pb-6 overflow-y-auto">
            {!picked ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((o) => (
                  <button key={o.id} onClick={() => choose(o)} className="text-left bg-pastel-beige hover:bg-pink-100 border-2 border-transparent hover:border-pink-300 focus-visible:border-pink-400 outline-none p-4 rounded-xl font-semibold text-gray-700 transition-all flex items-center shadow-sm">
                    <span className="bg-white text-pink-500 w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-sm font-bold shrink-0">{o.id}</span>
                    <span className="jp text-[15px] leading-tight">{o.text}</span>
                  </button>))}
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <div className={`flex items-center gap-2 font-bold text-xl mb-3 ${picked.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {picked.isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}{picked.isCorrect ? 'Chính xác!' : 'Sai rồi...'}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                  {!picked.isCorrect && <p className="jp text-green-600 font-bold mb-2">Đáp án đúng: {q.options.find((x) => x.isCorrect).text}</p>}
                  <p className="text-gray-800 font-medium mb-3 leading-relaxed text-sm">{q.explanation}</p>
                  <p className="text-pink-600 font-bold text-sm bg-pink-50 p-2 rounded-lg inline-block border border-pink-100">{whoLabel(m.who)}: {q.reaction}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => speak(q.options.find((x) => x.isCorrect).text)} className={`${btn} bg-pink-100 hover:bg-pink-200 text-pink-600 px-4`} aria-label="Nghe đáp án đúng"><Volume2 size={20} /></button>
                  <button onClick={next} className={`${btn} flex-1 bg-gray-800 hover:bg-black text-white py-3.5 shadow-md`}>{i < deck.length - 1 ? 'Tiếp tục' : 'Xem kết quả'} <ChevronRight size={20} /></button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}