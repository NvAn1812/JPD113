import { useState, useEffect } from 'react';
import { Heart, Play, BookOpen, Settings, CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, Home, Award, Volume2, ArrowLeft, Layers } from 'lucide-react';
import { GAME_DATA, META } from './gameData.js';
import { VOCAB_UNITS } from './kanjiData.js';
import { VOCAB_LESSONS } from './data.js';
import { Scene, Char, whoLabel } from './art.jsx';

const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* bỏ qua */ } },
};

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const makeDeck = () => GAME_DATA.map((q) => ({ ...q, options: shuffle(q.options).map((o, i) => ({ ...o, id: 'ABCD'[i] })) }));

const speak = (t) => {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(t.replace(/[「」（）()～]/g, '')); u.lang = 'ja-JP'; u.rate = 0.9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
};

const playSound = (isCorrect) => {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    
    if (isCorrect) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) { console.log(e); }
};

const btn = 'font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors';

const Toggle = ({ label, on, set }) => (
  <button onClick={() => set(!on)} role="switch" aria-checked={on} className="w-full flex items-center justify-between bg-pastel-beige rounded-2xl px-4 py-3 font-semibold text-gray-700">
    {label}<span className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? 'bg-pink-400' : 'bg-gray-300'}`}><span className={`block w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} /></span>
  </button>
);

const Shell = ({ title, onBack, children, fullWidth = false }) => (
  <div className="min-h-screen bg-pastel-pink flex flex-col items-center p-4">
    <div className={`w-full ${fullWidth ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <button onClick={onBack} className={`${btn} bg-white text-pink-600 px-4 py-2 mb-4 shadow-sm`}><ArrowLeft size={18} /> Trang chủ</button>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">{title}</h2>{children}
    </div>
  </div>
);

// GIAO DIỆN CHẾ ĐỘ DANH SÁCH BÌNH THƯỜNG
const VocabListCard = ({ w }) => {
  const [hv, kanji, kana, vi] = w;
  const say = (kana || kanji).split(/[・／]/)[0];
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col gap-1 hover:border-pink-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="jp text-2xl font-bold text-gray-800 leading-tight">{kanji}</div>
        <button onClick={() => speak(say)} aria-label="Nghe" className="p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 shrink-0"><Volume2 size={18} /></button>
      </div>
      {kana && <div className="jp text-pink-500 font-semibold">{kana}</div>}
      {hv && <span className="inline-block bg-amber-100 text-pastel-brown text-xs font-bold px-2 py-0.5 rounded-full mb-1 w-max">{hv}</span>}
      <div className="text-sm text-gray-600">{vi}</div>
    </div>
  );
};

// GIAO DIỆN FLASHCARD QUIZLET STYLE (Đã sửa lỗi mượt & bôi đen chữ)
const QuizletFlashcard = ({ w, onNext, onPrev, current, total }) => {
  const [flipped, setFlipped] = useState(false);
  const [hv, kanji, kana, vi] = w;
  const say = (kana || kanji).split(/[・／]/)[0];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) {
      // Delay nhẹ để UI xoay mượt trước, không bị giật do hàm đọc âm thanh chặn
      setTimeout(() => speak(say), 100); 
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-4 select-none">
      
      {/* Thẻ 3D */}
      <div className="relative w-full h-80 sm:h-96 [perspective:2000px] cursor-pointer" onClick={handleFlip}>
        
        {/* Dùng transition-transform để tăng tốc độ phần cứng, loại bỏ group-hover gây lỗi */}
        <div className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''} shadow-md hover:shadow-xl rounded-3xl`}>
          
          {/* Mặt trước (Chữ Nhật) */}
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-8 border-2 border-gray-100 flex flex-col items-center justify-center overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); speak(say); }} className="absolute top-4 right-4 p-3 rounded-full text-pink-500 hover:bg-pink-50 transition-colors"><Volume2 size={24} /></button>
            <div className="jp text-5xl sm:text-7xl font-bold text-gray-800 text-center leading-normal tracking-wide px-4">{kanji}</div>
            <div className="absolute bottom-6 text-gray-400 text-sm font-semibold opacity-60">👆 Chạm thẻ để lật</div>
          </div>

          {/* Mặt sau (Nghĩa) */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-pink-50 rounded-3xl p-8 border-2 border-pink-200 flex flex-col items-center justify-center text-center overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); speak(say); }} className="absolute top-4 right-4 p-3 rounded-full text-pink-500 hover:bg-pink-100 transition-colors"><Volume2 size={24} /></button>
            {kana && <div className="jp text-3xl sm:text-5xl text-pink-600 font-bold mb-6 leading-relaxed">{kana}</div>}
            {hv && <span className="inline-block bg-white text-pastel-brown text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm border border-amber-100">{hv}</span>}
            <div className="text-gray-800 font-medium text-xl sm:text-3xl px-6 leading-relaxed">{vi}</div>
          </div>
          
        </div>
      </div>

      {/* Cụm điều khiển (Lùi / Tới) */}
      <div className="flex items-center justify-between w-full max-w-md mt-10 gap-6">
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }} 
          disabled={current === 0}
          className={`p-4 rounded-full flex items-center justify-center transition-all ${current === 0 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-pink-600 bg-white shadow-md hover:bg-pink-50 hover:shadow-lg active:scale-95'}`}
        >
          <ChevronLeft size={28} strokeWidth={3} />
        </button>

        <span className="font-bold text-gray-600 text-lg tracking-widest">{current + 1} / {total}</span>

        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }} 
          disabled={current === total - 1}
          className={`p-4 rounded-full flex items-center justify-center transition-all ${current === total - 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-pink-600 bg-white shadow-md hover:bg-pink-50 hover:shadow-lg active:scale-95'}`}
        >
          <ChevronRight size={28} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState(() => store.get('jp_screen', 'start'));
  const [deck, setDeck] = useState(() => store.get('jp_deck', GAME_DATA));
  const [i, setI] = useState(() => store.get('jp_i', 0));
  const [score, setScore] = useState(() => store.get('jp_score', 0));
  const [combo, setCombo] = useState(() => store.get('jp_combo', 0));
  const [picked, setPicked] = useState(() => store.get('jp_picked', null));
  const [wrong, setWrong] = useState(() => store.get('jp_wrong', []));
  const [high, setHigh] = useState(() => store.get('japaneseGameHighScore', 0));
  const [sound, setSound] = useState(() => store.get('jp_sound', true));
  const [showVi, setShowVi] = useState(() => store.get('jp_showVi', true));
  
  const [unit, setUnit] = useState(() => store.get('jp_unit', 0));
  const [vtab, setVtab] = useState(() => store.get('jp_vtab', 'lesson'));
  const [flashcardMode, setFlashcardMode] = useState(() => store.get('jp_flashcard', false));
  const [cardIndex, setCardIndex] = useState(() => store.get('jp_cardIndex', 0)); 

  useEffect(() => {
    store.set('jp_screen', screen);
    store.set('jp_deck', deck);
    store.set('jp_i', i);
    store.set('jp_score', score);
    store.set('jp_combo', combo);
    store.set('jp_picked', picked);
    store.set('jp_wrong', wrong);
    store.set('jp_unit', unit);
    store.set('jp_vtab', vtab);
    store.set('jp_flashcard', flashcardMode);
    store.set('jp_cardIndex', cardIndex);
  }, [screen, deck, i, score, combo, picked, wrong, unit, vtab, flashcardMode, cardIndex]);

  const units = vtab === 'kanji' ? VOCAB_UNITS : VOCAB_LESSONS;
  const switchTab = (t) => { setVtab(t); setUnit(0); setCardIndex(0); };

  const q = deck[i] || GAME_DATA[0];
  const home = () => setScreen('start');
  
  useEffect(() => { if (screen === 'play' && sound && !picked) speak(q.dialogue); }, [screen, i]);

  const start = () => { 
    setDeck(makeDeck()); 
    setI(0); setScore(0); setCombo(0); setPicked(null); setWrong([]); 
    setScreen('play'); 
  };
  
  const choose = (o) => {
    if (picked) return;
    setPicked(o);
    playSound(o.isCorrect); 
    if (o.isCorrect) { 
      setScore((s) => s + 100 + combo * 10); 
      setCombo((c) => c + 1); 
    } else { 
      setCombo(0); 
      setWrong((w) => [...w, { q, o }]); 
    }
  };

  const next = () => {
    if (i < deck.length - 1) { setI(i + 1); setPicked(null); return; }
    if (score > high) { setHigh(score); store.set('japaneseGameHighScore', score); }
    setScreen('result');
  };
  const setS = (k, fn) => (v) => { fn(v); store.set(k, v); };

  // --- MÀN HÌNH TỪ VỰNG ---
  if (screen === 'vocab') return (
    <Shell title="Thẻ Học Quizlet" onBack={home} fullWidth={flashcardMode}>
      <div className="flex gap-2 mb-3">
        {[['lesson', 'Từ vựng theo bài'], ['kanji', 'Hán tự Kanji']].map(([k, label]) => (
          <button key={k} onClick={() => switchTab(k)} className={`${btn} px-5 py-2.5 text-sm ${vtab === k ? 'bg-gray-800 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200'}`}>{label}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-[55%] hide-scrollbar">
          {units.map((u, n) => (
            <button key={u.unit} onClick={() => { setUnit(n); setCardIndex(0); }} className={`${btn} px-4 py-2 text-sm whitespace-nowrap ${unit === n ? 'bg-pink-400 text-white shadow-md' : 'bg-white text-pink-600 border border-pink-100'}`}>{u.unit} ({u.words.length})</button>
          ))}
        </div>
        <button onClick={() => setFlashcardMode(!flashcardMode)} className={`${btn} px-4 py-2 text-sm ml-auto ${flashcardMode ? 'bg-green-500 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200'}`}>
          {flashcardMode ? 'Xem Danh Sách' : <><Layers size={16} /> Bật chế độ Lật Thẻ</>}
        </button>
      </div>
      
      {flashcardMode ? (
        // Truyền key={cardIndex} để React xóa thẻ cũ và tạo thẻ mới ngay lập tức khi bấm Next/Prev
        <QuizletFlashcard 
          key={cardIndex} 
          w={units[unit]?.words[cardIndex]} 
          current={cardIndex} 
          total={units[unit]?.words.length}
          onNext={() => setCardIndex(c => Math.min(c + 1, units[unit]?.words.length - 1))}
          onPrev={() => setCardIndex(c => Math.max(c - 1, 0))}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {units[unit]?.words.map((w, n) => <VocabListCard key={vtab + unit + n} w={w} />)}
        </div>
      )}
    </Shell>
  );

  // --- CÀI ĐẶT ---
  if (screen === 'settings') return (
    <Shell title="Cài đặt" onBack={home}>
      <div className="flex flex-col gap-3 max-w-md bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
        <Toggle label="Tự động đọc câu thoại" on={sound} set={setS('jp_sound', setSound)} />
        <Toggle label="Hiện bản dịch tiếng Việt" on={showVi} set={setS('jp_showVi', setShowVi)} />
        <div className="h-px w-full bg-gray-100 my-2"></div>
        <button onClick={() => { setHigh(0); store.set('japaneseGameHighScore', 0); }} className={`${btn} bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-700 py-3`}>Xóa kỷ lục hiện tại ({high})</button>
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
            <button onClick={start} className={`${btn} w-full bg-pink-400 hover:bg-pink-500 text-white py-4 shadow-lg shadow-pink-200`}><Play fill="currentColor" /> {score > 0 ? 'Bắt đầu ván mới' : 'Bắt đầu ngay'}</button>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setScreen('vocab')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><BookOpen size={18} /> Thẻ học</button>
              <button onClick={() => setScreen('settings')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><Settings size={18} /> Cài đặt</button>
            </div>
            {score > 0 && deck.length > 0 && (
               <button onClick={() => setScreen('play')} className={`${btn} w-full bg-green-500 hover:bg-green-600 text-white py-3 shadow-md mt-2`}>Tiếp tục màn chơi đang dở</button>
            )}
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
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {wrong.map(({ q: w, o }) => (
                  <li key={w.id} className="text-sm bg-red-50 rounded-xl p-3 border border-red-100">
                    <div className="text-gray-500 mb-1">{w.situation}</div>
                    <div className="jp text-red-500 line-through mb-1 opacity-70">{o.text}</div>
                    <div className="jp text-green-600 font-bold">{w.options.find((x) => x.isCorrect).text}</div>
                  </li>))}
              </ul>
            </div>)}
          <div className="flex gap-4">
            <button onClick={start} className={`${btn} flex-1 bg-pink-400 hover:bg-pink-500 text-white py-3`}><RotateCcw size={18} /> Chơi lại</button>
            <button onClick={() => { setScore(0); home(); }} className={`${btn} flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3`}><Home size={18} /> Trang chủ</button>
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
            <button onClick={home} className="bg-white/90 p-1.5 rounded-full text-gray-700 shadow hover:bg-pink-50" aria-label="Về trang chủ"><Home size={20} /></button>
            <div className="flex gap-2 items-center">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-pink-600 shadow">Điểm: {score}</div>
              {combo > 1 && <div className="bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow animate-pulse">Combo x{combo}!</div>}
            </div>
            <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-600">{i + 1} / {deck.length}</div>
          </div>
          <div className="mt-3 h-2 bg-white/40 rounded-full overflow-hidden"><div className="h-full bg-pink-400 transition-all duration-500" style={{ width: `${((i + (picked ? 1 : 0)) / deck.length) * 100}%` }} /></div>
        </div>

        <div className="flex-1 relative min-h-[220px] overflow-hidden bg-pink-50">
          <Scene name={m.scene} />
          <div className="absolute top-20 inset-x-0 flex justify-center z-20"><span className="bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-sm border border-pink-100 text-pink-500 font-bold">Bối cảnh: {q.situation}</span></div>
          <div className="absolute bottom-0 inset-x-0 h-[78%] flex justify-center z-10 drop-shadow-xl"><Char who={m.who} mood={mood} /></div>
        </div>

        <div className="w-full z-30 flex flex-col bg-white relative max-h-[58%] sm:max-h-[55%]">
          <div className="mx-4 -mt-10 mb-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-pink-200 p-5 relative z-40">
            <div className="absolute -top-4 left-4 bg-pink-500 text-white px-5 py-1 rounded-full font-bold text-sm shadow-md">{q.speaker}</div>
            <button onClick={() => speak(q.dialogue)} aria-label="Nghe lại câu thoại" className="absolute top-3 right-3 p-2 rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100"><Volume2 size={18} /></button>
            <p className="jp text-xl font-bold text-gray-800 mt-2 mb-1 tracking-wide pr-10">{q.dialogue}</p>
            {showVi && <p className="text-gray-500 text-sm italic">{q.translate}</p>}
          </div>
          <div className="px-4 pb-6 overflow-y-auto">
            {!picked ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((o) => (
                  <button key={o.id} onClick={() => choose(o)} className="text-left bg-pastel-beige hover:bg-pink-100 border-2 border-transparent hover:border-pink-300 focus-visible:border-pink-400 outline-none p-4 rounded-xl font-semibold text-gray-700 transition-all flex items-center shadow-sm hover:-translate-y-0.5">
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
                  <button onClick={() => speak(q.options.find((x) => x.isCorrect).text)} className={`${btn} bg-pink-50 hover:bg-pink-100 text-pink-500 px-4`} aria-label="Nghe đáp án đúng"><Volume2 size={20} /></button>
                  <button onClick={next} className={`${btn} flex-1 bg-gray-800 hover:bg-black text-white py-3.5 shadow-md`}>{i < deck.length - 1 ? 'Tiếp tục' : 'Xem kết quả'} <ChevronRight size={20} /></button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
}