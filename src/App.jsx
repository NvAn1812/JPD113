import { useState, useEffect } from 'react';
import { Heart, Play, BookOpen, Settings, CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, Home, Award, Volume2, ArrowLeft, Layers, PenTool } from 'lucide-react';
import { GAME_DATA, META } from './gameData.js';
import { VOCAB_UNITS } from './kanjiData.js';
import { VOCAB_LESSONS } from './data.js';
import { Scene, Char, whoLabel } from './art.jsx';

// Tiện ích lưu trữ LocalStorage an toàn
const store = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* bỏ qua */ } },
};

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const makeDeck = () => GAME_DATA.map((q) => ({ ...q, options: shuffle(q.options).map((o, i) => ({ ...o, id: 'ABCD'[i] })) }));

// Tạo bộ đề thi trắc nghiệm ngẫu nhiên
const makeTestDeck = (type, unitIdx) => {
  const source = type === 'kanji' ? VOCAB_UNITS : VOCAB_LESSONS;
  let pool = [];
  if (unitIdx === -1) {
    source.forEach(u => pool.push(...u.words));
  } else {
    pool = [...source[unitIdx]?.words || []];
  }
  
  // Lấy ngẫu nhiên tối đa 15 câu hỏi cho 1 bài thi
  const selected = shuffle(pool).slice(0, 15);
  const allVi = source.flatMap(u => u.words.map(w => w[3])); // Lấy tất cả nghĩa tiếng Việt làm đáp án nhiễu

  return selected.map(w => {
    const correctVi = w[3];
    let wrongs = allVi.filter(v => v !== correctVi);
    wrongs = shuffle(wrongs).slice(0, 3); // Chọn 3 đáp án sai ngẫu nhiên
    const options = shuffle([
      { text: correctVi, isCorrect: true },
      ...wrongs.map(text => ({ text, isCorrect: false }))
    ]).map((o, i) => ({ ...o, id: 'ABCD'[i] }));
    
    return { word: w, options };
  });
};

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

const Shell = ({ title, onBack, children, fullWidth = false, color = 'pink' }) => (
  <div className={`min-h-screen flex flex-col items-center p-4 ${color === 'blue' ? 'bg-blue-50' : 'bg-pastel-pink'}`}>
    <div className={`w-full ${fullWidth ? 'max-w-5xl' : 'max-w-3xl'}`}>
      <button onClick={onBack} className={`${btn} bg-white ${color === 'blue' ? 'text-blue-600' : 'text-pink-600'} px-4 py-2 mb-4 shadow-sm`}><ArrowLeft size={18} /> Trang chủ</button>
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

// GIAO DIỆN FLASHCARD QUIZLET STYLE
const QuizletFlashcard = ({ w, onNext, onPrev, current, total }) => {
  const [flipped, setFlipped] = useState(false);
  
  useEffect(() => { setFlipped(false); }, [w]);

  const [hv, kanji, kana, vi] = w;
  const say = (kana || kanji).split(/[・／]/)[0];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) { setTimeout(() => speak(say), 100); }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-4 select-none">
      <div className="relative w-full h-80 sm:h-96 [perspective:2000px] cursor-pointer" onClick={handleFlip}>
        <div className={`relative w-full h-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''} shadow-md hover:shadow-xl rounded-3xl`}>
          
          <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-3xl p-8 border-2 border-gray-100 flex flex-col items-center justify-center overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); speak(say); }} className="absolute top-4 right-4 p-3 rounded-full text-pink-500 hover:bg-pink-50 transition-colors"><Volume2 size={24} /></button>
            <div className="jp text-5xl sm:text-7xl font-bold text-gray-800 text-center leading-normal tracking-wide px-4">{kanji}</div>
            <div className="absolute bottom-6 text-gray-400 text-sm font-semibold opacity-60">👆 Chạm thẻ để lật</div>
          </div>

          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-pink-50 rounded-3xl p-8 border-2 border-pink-200 flex flex-col items-center justify-center text-center overflow-hidden">
            <button onClick={(e) => { e.stopPropagation(); speak(say); }} className="absolute top-4 right-4 p-3 rounded-full text-pink-500 hover:bg-pink-100 transition-colors"><Volume2 size={24} /></button>
            {kana && <div className="jp text-3xl sm:text-5xl text-pink-600 font-bold mb-6 leading-relaxed">{kana}</div>}
            {hv && <span className="inline-block bg-white text-pastel-brown text-sm font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm border border-amber-100">{hv}</span>}
            <div className="text-gray-800 font-medium text-xl sm:text-3xl px-6 leading-relaxed">{vi}</div>
          </div>
          
        </div>
      </div>

      <div className="flex items-center justify-between w-full max-w-md mt-10 gap-6">
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }} disabled={current === 0} className={`p-4 rounded-full flex items-center justify-center transition-all ${current === 0 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-pink-600 bg-white shadow-md hover:bg-pink-50 hover:shadow-lg active:scale-95'}`}><ChevronLeft size={28} strokeWidth={3} /></button>
        <span className="font-bold text-gray-600 text-lg tracking-widest">{current + 1} / {total}</span>
        <button onClick={(e) => { e.stopPropagation(); onNext(); }} disabled={current === total - 1} className={`p-4 rounded-full flex items-center justify-center transition-all ${current === total - 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-pink-600 bg-white shadow-md hover:bg-pink-50 hover:shadow-lg active:scale-95'}`}><ChevronRight size={28} strokeWidth={3} /></button>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState(() => store.get('jp_screen', 'start'));
  
  // Game Cốt truyện States
  const [deck, setDeck] = useState(() => store.get('jp_deck', GAME_DATA));
  const [i, setI] = useState(() => store.get('jp_i', 0));
  const [score, setScore] = useState(() => store.get('jp_score', 0));
  const [combo, setCombo] = useState(() => store.get('jp_combo', 0));
  const [picked, setPicked] = useState(() => store.get('jp_picked', null));
  const [wrong, setWrong] = useState(() => store.get('jp_wrong', []));
  const [high, setHigh] = useState(() => store.get('japaneseGameHighScore', 0));
  
  // Settings
  const [sound, setSound] = useState(() => store.get('jp_sound', true));
  const [showVi, setShowVi] = useState(() => store.get('jp_showVi', true));
  
  // Từ Vựng States
  const [unit, setUnit] = useState(() => store.get('jp_unit', 0));
  const [vtab, setVtab] = useState(() => store.get('jp_vtab', 'lesson'));
  const [flashcardMode, setFlashcardMode] = useState(() => store.get('jp_flashcard', false));
  const [cardIndex, setCardIndex] = useState(() => store.get('jp_cardIndex', 0)); 

  // Kiểm tra (Test) States
  const [tDeck, setTDeck] = useState(() => store.get('jp_tDeck', []));
  const [tIndex, setTIndex] = useState(() => store.get('jp_tIndex', 0));
  const [tScore, setTScore] = useState(() => store.get('jp_tScore', 0));
  const [tPicked, setTPicked] = useState(() => store.get('jp_tPicked', null));
  const [tWrong, setTWrong] = useState(() => store.get('jp_tWrong', []));
  const [tSetup, setTSetup] = useState(() => store.get('jp_tSetup', { type: 'lesson', unit: -1 }));

  // Lưu toàn bộ tiến trình
  useEffect(() => {
    store.set('jp_screen', screen); store.set('jp_deck', deck); store.set('jp_i', i);
    store.set('jp_score', score); store.set('jp_combo', combo); store.set('jp_picked', picked);
    store.set('jp_wrong', wrong); store.set('jp_unit', unit); store.set('jp_vtab', vtab);
    store.set('jp_flashcard', flashcardMode); store.set('jp_cardIndex', cardIndex);
    store.set('jp_tDeck', tDeck); store.set('jp_tIndex', tIndex); store.set('jp_tScore', tScore);
    store.set('jp_tPicked', tPicked); store.set('jp_tWrong', tWrong); store.set('jp_tSetup', tSetup);
  }, [screen, deck, i, score, combo, picked, wrong, unit, vtab, flashcardMode, cardIndex, tDeck, tIndex, tScore, tPicked, tWrong, tSetup]);

  const units = vtab === 'kanji' ? VOCAB_UNITS : VOCAB_LESSONS;
  const switchTab = (t) => { setVtab(t); setUnit(0); setCardIndex(0); };

  const q = deck[i] || GAME_DATA[0];
  const home = () => setScreen('start');
  
  useEffect(() => { if (screen === 'play' && sound && !picked) speak(q.dialogue); }, [screen, i]);

  const start = () => { 
    setDeck(makeDeck()); setI(0); setScore(0); setCombo(0); setPicked(null); setWrong([]); setScreen('play'); 
  };
  
  const choose = (o) => {
    if (picked) return;
    setPicked(o);
    playSound(o.isCorrect); 
    if (o.isCorrect) { setScore((s) => s + 100 + combo * 10); setCombo((c) => c + 1); } 
    else { setCombo(0); setWrong((w) => [...w, { q, o }]); }
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

  // --- MÀN HÌNH SETUP BÀI KIỂM TRA ---
  if (screen === 'test_setup') {
    const testSource = tSetup.type === 'kanji' ? VOCAB_UNITS : VOCAB_LESSONS;
    return (
      <Shell title="Cấu Hình Bài Thi" onBack={home} color="blue">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-lg">1. Chọn nội dung thi:</h3>
            <div className="flex gap-3">
              <button onClick={() => setTSetup({...tSetup, type: 'lesson', unit: -1})} className={`${btn} flex-1 py-3 ${tSetup.type === 'lesson' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Từ vựng theo bài</button>
              <button onClick={() => setTSetup({...tSetup, type: 'kanji', unit: -1})} className={`${btn} flex-1 py-3 ${tSetup.type === 'kanji' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Hán tự Kanji</button>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-lg">2. Chọn phạm vi bài:</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTSetup({...tSetup, unit: -1})} className={`${btn} px-5 py-2.5 text-sm ${tSetup.unit === -1 ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Trộn tất cả</button>
              {testSource.map((u, n) => (
                <button key={u.unit} onClick={() => setTSetup({...tSetup, unit: n})} className={`${btn} px-5 py-2.5 text-sm ${tSetup.unit === n ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{u.unit}</button>
              ))}
            </div>
          </div>
          <div className="h-px w-full bg-gray-100 my-2"></div>
          <button onClick={() => {
            setTDeck(makeTestDeck(tSetup.type, tSetup.unit));
            setTIndex(0); setTScore(0); setTWrong([]); setTPicked(null);
            setScreen('test_play');
          }} className={`${btn} bg-blue-500 hover:bg-blue-600 text-white py-4 mt-2 shadow-md text-lg`}>
            Bắt đầu thi ngay!
          </button>
        </div>
      </Shell>
    );
  }

  // --- MÀN HÌNH CHƠI BÀI KIỂM TRA ---
  if (screen === 'test_play') {
    const tq = tDeck[tIndex];
    if (!tq) return null;
    const [hv, kanji, kana, vi] = tq.word;
    const say = (kana || kanji).split(/[・／]/)[0];

    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4">
        <div className="w-full max-w-2xl mt-2 sm:mt-10">
           {/* Header Bài thi */}
           <div className="flex justify-between items-center mb-6">
              <button onClick={() => setScreen('test_setup')} className="bg-white p-2 rounded-full text-gray-700 shadow hover:bg-gray-50 transition-colors" aria-label="Thoát bài thi"><XCircle size={24}/></button>
              <div className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-blue-600 shadow">Điểm: {tScore}</div>
              <div className="bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 shadow">{tIndex + 1} / {tDeck.length}</div>
           </div>
           
           {/* Thẻ câu hỏi */}
           <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border-2 border-blue-100 flex flex-col items-center justify-center mb-6 relative min-h-[200px]">
              <button onClick={() => speak(say)} className="absolute top-4 right-4 p-3 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Volume2 size={24}/></button>
              <div className="jp text-6xl sm:text-7xl font-bold text-gray-800 mb-4 text-center">{kanji}</div>
              {/* Nếu thi Hán tự, hiển thị thêm âm Hán Việt để dễ nhận diện. Thi từ vựng thì hiển thị Furigana */}
              {tSetup.type === 'kanji' ? (
                hv && <span className="inline-block bg-amber-100 text-pastel-brown text-sm font-bold px-3 py-1 rounded-full">{hv}</span>
              ) : (
                kana && <div className="jp text-2xl text-blue-500 font-semibold">{kana}</div>
              )}
           </div>

           {/* 4 Đáp án */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {tq.options.map(o => (
                <button key={o.id} onClick={() => {
                  if (tPicked) return;
                  setTPicked(o);
                  playSound(o.isCorrect);
                  if (o.isCorrect) setTScore(s => s + 10);
                  else setTWrong(w => [...w, tq]);
                }} className={`text-left p-5 rounded-2xl font-bold transition-all duration-300 flex items-center shadow-sm border-2 
                  ${!tPicked ? 'bg-white hover:border-blue-400 hover:shadow-md border-transparent text-gray-700 hover:-translate-y-1' 
                    : o.isCorrect ? 'bg-green-100 border-green-400 text-green-700 scale-[1.02]' 
                    : tPicked.id === o.id ? 'bg-red-100 border-red-400 text-red-700' 
                    : 'bg-white border-transparent text-gray-400 opacity-40'}`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 shadow-sm shrink-0 ${!tPicked ? 'bg-blue-100 text-blue-600' : o.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>{o.id}</span>
                  <span className="text-[16px] leading-tight">{o.text}</span>
                </button>
              ))}
           </div>

           {/* Nút Tiếp tục */}
           {tPicked && (
             <button onClick={() => {
               if (tIndex < tDeck.length - 1) { setTIndex(tIndex + 1); setTPicked(null); }
               else setScreen('test_result');
             }} className={`${btn} w-full bg-blue-500 hover:bg-blue-600 text-white py-4 shadow-md text-lg animate-fade-in-up`}>
               {tIndex < tDeck.length - 1 ? 'Câu tiếp theo' : 'Nộp bài & Xem kết quả'} <ChevronRight size={20}/>
             </button>
           )}
        </div>
      </div>
    );
  }

  // --- KẾT QUẢ BÀI KIỂM TRA ---
  if (screen === 'test_result') {
    const total = tDeck.length;
    const correct = total - tWrong.length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const rankColor = percent === 100 ? 'text-yellow-500' : percent >= 80 ? 'text-green-500' : percent >= 50 ? 'text-blue-500' : 'text-red-500';
    
    return (
      <Shell title="Kết Quả Bài Thi" onBack={home} color="blue">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-t-8 border-blue-500 max-w-lg mx-auto">
          <div className="text-gray-500 font-bold mb-2">ĐỘ CHÍNH XÁC</div>
          <div className={`text-7xl font-black ${rankColor} mb-2 animate-pop`}>{percent}%</div>
          <p className="text-gray-600 font-bold mb-6 text-lg">Đúng {correct} trên tổng số {total} câu</p>
          
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex justify-between items-center">
            <span className="text-gray-600 font-bold">Tổng điểm:</span>
            <span className="text-2xl font-black text-blue-600">{tScore}</span>
          </div>

          {tWrong.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-bold text-gray-700 mb-3">Những từ cần ôn lại ({tWrong.length}):</h3>
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {tWrong.map((w, idx) => (
                  <li key={idx} className="bg-red-50 rounded-2xl p-4 border border-red-100 flex flex-col gap-1">
                    <div className="jp text-xl font-bold text-gray-800">{w.word[1]} <span className="text-red-500 text-base font-normal ml-1">{w.word[2] ? `(${w.word[2]})` : ''}</span></div>
                    <div className="text-gray-700 font-medium mt-1">Nghĩa đúng: <span className="text-green-600 font-bold">{w.word[3]}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex gap-4">
            <button onClick={() => setScreen('test_setup')} className={`${btn} flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3.5`}><RotateCcw size={18} /> Thi lại</button>
          </div>
        </div>
      </Shell>
    );
  }

  // --- CÀI ĐẶT ---
  if (screen === 'settings') return (
    <Shell title="Cài đặt" onBack={home}>
      <div className="flex flex-col gap-3 max-w-md bg-white p-6 rounded-3xl shadow-sm border border-pink-100 mx-auto">
        <Toggle label="Tự động đọc câu thoại/từ vựng" on={sound} set={setS('jp_sound', setSound)} />
        <Toggle label="Hiện bản dịch tiếng Việt (Cốt truyện)" on={showVi} set={setS('jp_showVi', setShowVi)} />
        <div className="h-px w-full bg-gray-100 my-2"></div>
        <button onClick={() => { setHigh(0); store.set('japaneseGameHighScore', 0); }} className={`${btn} bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-700 py-3`}>Xóa kỷ lục cốt truyện ({high})</button>
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
          <h2 className="text-lg text-gray-500 mb-2 font-semibold">Giao tiếp tiếng Nhật cơ bản</h2>
          
          <div className="flex flex-col gap-4 mt-6">
            {score > 0 && deck.length > 0 && (
               <button onClick={() => setScreen('play')} className={`${btn} w-full bg-green-500 hover:bg-green-600 text-white py-3 shadow-md`}>Tiếp tục màn chơi đang dở</button>
            )}
            <button onClick={start} className={`${btn} w-full bg-pink-400 hover:bg-pink-500 text-white py-4 shadow-lg shadow-pink-200`}><Play fill="currentColor" /> {score > 0 ? 'Chơi lại từ đầu' : 'Chơi Cốt Truyện'}</button>
            
            {/* Nút Làm Bài Kiểm Tra mới */}
            <button onClick={() => setScreen('test_setup')} className={`${btn} w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 shadow-md`}><PenTool size={18} /> Thi Trắc Nghiệm</button>
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setScreen('vocab')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><BookOpen size={18} /> Thẻ học</button>
              <button onClick={() => setScreen('settings')} className={`${btn} bg-pastel-beige hover:bg-amber-100 text-pastel-brown py-3`}><Settings size={18} /> Cài đặt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- KẾT QUẢ CỐT TRUYỆN ---
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

  // --- MÀN HÌNH CHƠI CỐT TRUYỆN ---
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