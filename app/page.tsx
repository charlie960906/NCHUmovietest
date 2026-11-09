"use client";

import { useEffect, useRef, useState } from "react";

type CharacterKey = "A" | "B" | "C" | "D";
type Question = { q: string; options: [string, CharacterKey][] };
type Character = { emoji: string; name: string; tag: string; description: string; pills: string[]; message: string };

const questions: Question[] = [
  { q: "當你遇到環境與文化的衝突，你會怎麼做？", options: [["先築起防備，觀察很久才靠近", "A"], ["主動認識新朋友，讓自己融入其中", "B"], ["先把生活安排妥當，穩定下來再說", "C"], ["安靜觀察每個人的感受，試著理解彼此", "D"]] },
  { q: "和家人或親近的人發生摩擦時，你通常會？", options: [["嘴上逞強、暫時拉開距離，其實很在意", "A"], ["用撒嬌或玩笑緩和氣氛", "B"], ["先把情緒收起來，繼續處理該做的事", "C"], ["等彼此冷靜後，溫柔地重新開口", "D"]] },
  { q: "突如其來的壓力與不確定性出現時，你會？", options: [["表面裝沒事，私下反覆想很多", "A"], ["找人聊聊，讓自己不要陷進情緒裡", "B"], ["列出計畫，把能控制的事情一一做好", "C"], ["先聽清楚內心，再陪自己慢慢走過去", "D"]] },
  { q: "當你需要安慰或宣洩情緒時，你會？", options: [["一個人待著，等自己整理好再說", "A"], ["找信任的人說個不停，哭完就好多了", "B"], ["做家事、工作或解決問題，讓自己忙起來", "C"], ["找一個安全的人靜靜陪著，不一定要說話", "D"]] },
  { q: "對你來說，「家」與「歸屬感」最接近什麼？", options: [["一個我仍在尋找、想被理解的地方", "A"], ["有人記得我、願意等我回去的地方", "B"], ["我願意用行動守護、讓大家安心的地方", "C"], ["不必解釋自己，也能被溫柔接住的關係", "D"]] },
];

const characters: Record<CharacterKey, Character> = {
  A: { emoji: "🌙", name: "梁芳儀 (Fen)", tag: "刺刺的外表下，是一顆渴望被理解的心", description: "你適應力強但情緒張力大，習慣用刺保護自己，對認同與歸屬有極高的追求。你不輕易交出脆弱，卻一直期待有人願意看見真實的你。", pills: ["敏感而堅韌", "強烈的自我感", "渴望被理解"], message: "你的力量，是即使不安，也仍然努力尋找屬於自己的位置。" },
  B: { emoji: "🌷", name: "莉莉 (Lily)", tag: "愛得很深，卻常常忘了先照顧好自己", description: "你責任感極強，面對病痛與生活重擔仍想掌控一切，內心極度渴望家人的理解。你總是先照顧身邊的人，也請記得把溫柔留一點給自己。", pills: ["深沉的愛", "責任感強", "不輕易放手"], message: "你的愛像一盞燈，照亮家人，也值得有人回頭照亮你。" },
  C: { emoji: "🏡", name: "梁家誠 (Ray)", tag: "用務實與沉默，撐起整個家的後盾", description: "你默默付出、包容性強，不善言詞卻隨時準備好為愛的人提供溫暖與支持。你習慣用行動表達在乎，是讓人可以放心依靠的存在。", pills: ["可靠務實", "安靜守護", "包容力強"], message: "你的沉默不是距離，而是一種把重要的人穩穩接住的方式。" },
  D: { emoji: "✨", name: "梁芳安 (Ann)", tag: "純真而敏銳，默默觀察著世界的改變", description: "你善良隨和，在家庭動盪中扮演潤滑劑，擁有純粹的包容力與溫和的特質。你總能察覺細微的情緒變化，讓身邊的人感到安心。", pills: ["純真敏銳", "溫和包容", "細膩觀察"], message: "你的溫柔不喧嘩，卻能在關係裂縫裡留下重新靠近的可能。" },
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Partial<Record<CharacterKey, number>>>({});
  const [view, setView] = useState<"start" | "quiz" | "loading" | "result">("start");
  const [resultKey, setResultKey] = useState<CharacterKey>("A");
  const [shareUrl, setShareUrl] = useState("");
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (view !== "loading" && view !== "result") return;
    const targetId = view === "loading" ? "loading" : "result-area";
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  const start = () => {
    setStep(0);
    setScores({});
    setView("quiz");
    window.setTimeout(() => {
      const quiz = document.getElementById("quiz");
      if (quiz) window.scrollTo({ top: quiz.getBoundingClientRect().top + window.scrollY - 28, behavior: "smooth" });
    }, 180);
  };

  const answer = (key: CharacterKey) => {
    const nextScores = { ...scores, [key]: (scores[key] ?? 0) + 1 };
    if (step + 1 < questions.length) {
      setScores(nextScores);
      setStep(step + 1);
      return;
    }
    setScores(nextScores);
    setView("loading");
    window.setTimeout(() => {
      const winner = (Object.keys(characters) as CharacterKey[]).sort((a, b) => (nextScores[b] ?? 0) - (nextScores[a] ?? 0))[0];
      setResultKey(winner);
      setView("result");
    }, 2000);
  };

  const character = characters[resultKey];
  const shareText = `我在《美國女孩》角色測驗中是「${character.name}」！\n${character.tag}\n你是哪個角色？一起測驗： ${shareUrl}\n#美國女孩 #中興國際星空電影節`;
  const copyText = async () => {
    if (!navigator.clipboard) {
      setToast("此瀏覽器不支援複製，請手動截圖分享");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setToast("專屬分享文案已複製");
    } catch {
      setToast("複製失敗，請手動截圖分享");
    }
    window.setTimeout(() => setToast(""), 2200);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const shareSocial = () => {
    if (navigator.share) {
      navigator.share({ title: "你是《美國女孩》中的哪個角色？", text: shareText, url: shareUrl }).catch(() => undefined);
      return;
    }
    setToast("此瀏覽器不支援系統分享，請先複製文字");
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <>
      <header className={`hero ${view !== "start" ? "started" : ""}`}>
        <div className="hero-copy">
          <div className="eyebrow">NCHU 國際星空電影節 | 放映作品</div>
          <h1>你是《美國女孩》<br />中的哪個角色？</h1>
          <p>用 5 個問題，看看你與哪一種「愛與歸屬」最靠近。</p>
        </div>
        {view === "start" && <button className="btn start-action" onClick={start}>開始測驗　→</button>}
        {view === "quiz" && <section className="quiz" id="quiz" aria-live="polite">
          <div className="progress-head"><span>第 {step + 1} / {questions.length} 題</span><span>約 1 分鐘</span></div>
          <div className="bar"><i style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
          <h2 className="q">{questions[step].q.replace(/，/g, "，\n")}</h2>
          <div>{questions[step].options.map(([label, key]) => <button className="opt" key={label} onClick={() => answer(key)}>{label}</button>)}</div>
        </section>}
      </header>
      <main className={view === "loading" || view === "result" ? "state-main" : ""}>
        {view === "loading" && <section className="card loading-card" id="loading"><div className="spinner" /><h2>正在判斷中</h2><p>正在整理你與角色之間的連結⋯⋯</p></section>}
        {view === "result" && <div className="result-area" id="result-area">
          <section className="card res">
            <div className="result-top"><div className="character-mark">{character.emoji}</div><div><h2>{character.name}</h2><p className="match-rate">角色契合度 {Math.round(((scores[resultKey] ?? 0) / questions.length) * 100)}%</p></div></div>
            <p className="sub">「{character.tag}」</p><p className="res-desc">{character.description}</p>
            <div className="pills">{character.pills.map((pill) => <span key={pill}>{pill}</span>)}</div>
            <div className="match">💫 {character.message}</div><p className="section-label">分享你的角色結果</p>
            <div className="actions"><button className="btn" onClick={() => dialogRef.current?.showModal()}>分享結果</button><button className="btn secondary" onClick={start}>再測一次</button></div>
          </section>
          <section className="card cta event-info"><div className="event-copy"><h3>🎬 電影節資訊</h3><p>了解中興大學國際星空電影節的放映活動與最新消息。</p></div><a className="btn" href="https://luma.com/34dolgs3" target="_blank" rel="noreferrer">查看電影節資訊</a></section>
        </div>}
      </main>
      <div className="bottom-credit">中興大學國際星空電影節</div>
      <div className={`toast ${toast ? "on" : ""}`} role="status">{toast}</div>
      <dialog className="share-dialog" ref={dialogRef}><h2>分享你的角色結果</h2><p>複製文字，或開啟系統分享選單選擇社群。</p><div className="actions"><button className={`btn copy-button ${copied ? "is-copied" : ""}`} onClick={copyText} aria-label={copied ? "已複製文字" : "複製文字"}><span className="copy-state">{copied ? "已複製" : "複製文字"}</span></button><button className="btn secondary" onClick={shareSocial}>分享到社群</button></div><button className="btn secondary close-share" onClick={() => dialogRef.current?.close()}>關閉</button></dialog>
    </>
  );
}
