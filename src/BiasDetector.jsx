import { useState, useRef, useEffect } from "react";

/* ─── Colors ─── */
const C = {
  textDark: "#111122",
  textBody: "#222238",
  textMid: "#3a3a55",
  textLight: "#6a6a88",
  white: "#ffffff",
  green: "#157040",
  greenBg: "rgba(21,112,64,0.08)",
  greenBorder: "rgba(21,112,64,0.2)",
  red: "#b8304a",
  redBg: "rgba(184,48,74,0.07)",
  redBorder: "rgba(184,48,74,0.15)",
};

const BIAS_STYLE = {
  leading:            { bg: "rgba(184,48,74,0.10)", border: "#B8304A", dot: "#B8304A" },
  "double-barreled":  { bg: "rgba(192,106,16,0.10)", border: "#C06A10", dot: "#C06A10" },
  "assumption-loaded":{ bg: "rgba(160,120,24,0.10)", border: "#A07818", dot: "#A07818" },
  jargon:             { bg: "rgba(96,64,168,0.10)", border: "#6040A8", dot: "#6040A8" },
  "social-desirability":{ bg: "rgba(26,120,72,0.10)", border: "#1A7848", dot: "#1A7848" },
  vague:              { bg: "rgba(122,96,32,0.10)", border: "#7A6020", dot: "#7A6020" },
  "order-bias":       { bg: "rgba(42,90,154,0.10)", border: "#2A5A9A", dot: "#2A5A9A" },
  framing:            { bg: "rgba(168,58,74,0.10)", border: "#A83A4A", dot: "#A83A4A" },
  hypothetical:       { bg: "rgba(90,106,138,0.10)", border: "#5A6A8A", dot: "#5A6A8A" },
  "validation-seeking":{ bg: "rgba(138,74,122,0.10)", border: "#8A4A7A", dot: "#8A4A7A" },
  improvement:        { bg: "rgba(42,122,154,0.10)", border: "#2A7A9A", dot: "#2A7A9A" },
  other:              { bg: "rgba(90,90,112,0.08)", border: "#5A5A70", dot: "#5A5A70" },
};

const BIAS_SEVERITY = {
  leading:"major", "double-barreled":"major", "assumption-loaded":"major",
  framing:"major", hypothetical:"major",
  "social-desirability":"critical", "validation-seeking":"critical",
  jargon:"minor", vague:"minor", "order-bias":"minor", improvement:"minor", other:"minor",
};

const BIAS_TOOLTIP = {
  en: { leading:"Suggests a desired answer", "double-barreled":"Asks two things at once",
    "assumption-loaded":"Assumes something not established", jargon:"Complex language for audience",
    "social-desirability":"Pressures 'correct' answers", vague:"Ambiguous terms like 'often'",
    "order-bias":"Placement contaminates later answers", framing:"Wording skews responses",
    hypothetical:"Imagined future, not real behavior", "validation-seeking":"Confirms instead of explores",
    improvement:"Could be stronger, not a bias", other:"Other issue" },
  cs: { leading:"Navádí k určité odpovědi", "double-barreled":"Ptá se na dvě věci najednou",
    "assumption-loaded":"Předpokládá něco nezjištěného", jargon:"Složitý jazyk pro cílovou skupinu",
    "social-desirability":"Tlačí k 'správným' odpovědím", vague:"Nejednoznačné výrazy",
    "order-bias":"Pořadí ovlivňuje další odpovědi", framing:"Formulace zkresluje odpovědi",
    hypothetical:"Hypotetická budoucnost", "validation-seeking":"Potvrzuje místo zkoumání",
    improvement:"Může být silnější", other:"Jiný problém" },
  de: { leading:"Suggeriert gewünschte Antwort", "double-barreled":"Fragt zwei Dinge gleichzeitig",
    "assumption-loaded":"Setzt etwas Unbestätigtes voraus", jargon:"Komplexe Sprache für Zielgruppe",
    "social-desirability":"Drängt zu 'richtigen' Antworten", vague:"Mehrdeutige Begriffe",
    "order-bias":"Reihenfolge beeinflusst spätere Antworten", framing:"Formulierung verzerrt",
    hypothetical:"Hypothetische Zukunft", "validation-seeking":"Bestätigt statt zu erforschen",
    improvement:"Kann stärker sein", other:"Anderes Problem" },
};

/* ─── Translations ─── */
const T = {
  en: {
    title: "Bloom Over Bias",
    subtitle: "Better questions. Better research.",
    desc: "Paste your discussion guide or survey and let AI spot hidden biases — leading questions, assumptions, jargon, and more. Get a cleaned-up version in one click.",
    placeholder: "Paste your interview guide or survey questions here…Example:1. Don't you think our new design is intuitive?2. How satisfied are you with our amazing product?3. What's your age and income level?4. Why did you choose us over the inferior competitors?",
    analyze: "Bloom it",
    analyzing: "Your guide is blooming…",
    score: "Neutrality Score",
    findings: "Findings",
    overview: "Overall",
    beforeAfter: "Before → After",
    before: "Before",
    after: "After",
    suggestion: "Why it matters",
    noIssues: "Looking good! No major biases detected.",
    reset: "Clear all",
    copy: "Copy improved version",
    copied: "Copied!",
    original: "Your original",
    improved: "Improved version",
    recs: "Recommendations",
    interview: "Interview",
    survey: "Survey",
    guideType: "Type",
    detected: "issues detected",
    biasLabels: {
      leading: "Leading",
      "double-barreled": "Double-barreled",
      "assumption-loaded": "Assumption",
      jargon: "Jargon",
      "social-desirability": "Social desirability",
      vague: "Vague",
      "order-bias": "Order bias",
      framing: "Framing",
      hypothetical: "Hypothetical",
      "validation-seeking": "Validation-seeking",
      improvement: "Improvement",
      other: "Other",
    },
  },
  cs: {
    title: "Bloom Over Bias",
    subtitle: "Lepší otázky. Lepší výzkum.",
    desc: "Vložte svůj discussion guide nebo dotazník a nechte AI najít skryté biasy — návodné otázky, předpoklady, žargon a další. Vylepšenou verzi zkopírujete jedním klikem.",
    placeholder: "Vložte sem svůj interview guide nebo otázky z dotazníku…Příklad:1. Nemyslíte, že náš nový design je intuitivní?2. Jak jste spokojeni s naším skvělým produktem?3. Jaký je váš věk a příjem?4. Proč jste si vybrali nás místo horší konkurence?",
    analyze: "Bloom it",
    analyzing: "Your guide is blooming…",
    score: "Skóre neutrality",
    findings: "Nálezy",
    overview: "Celkově",
    beforeAfter: "Před → Po",
    before: "Před",
    after: "Po",
    suggestion: "Proč na tom záleží",
    noIssues: "Vypadá to dobře! Žádné závažné biasy.",
    reset: "Vymazat vše",
    copy: "Kopírovat vylepšenou verzi",
    copied: "Zkopírováno!",
    original: "Váš originál",
    improved: "Vylepšená verze",
    recs: "Doporučení",
    interview: "Rozhovor",
    survey: "Dotazník",
    guideType: "Typ",
    detected: "nalezených problémů",
    biasLabels: {
      leading: "Návodná",
      "double-barreled": "Dvojitá",
      "assumption-loaded": "Předpoklad",
      jargon: "Žargon",
      "social-desirability": "Soc. žádoucnost",
      vague: "Vágní",
      "order-bias": "Pořadí",
      framing: "Rámování",
      hypothetical: "Hypotetická",
      "validation-seeking": "Validační",
      improvement: "Vylepšení",
      other: "Ostatní",
    },
  },
  de: {
    title: "Bloom Over Bias",
    subtitle: "Bessere Fragen. Bessere Forschung.",
    desc: "Fügen Sie Ihren Leitfaden oder Ihre Umfrage ein und lassen Sie KI versteckte Verzerrungen finden. Kopieren Sie die bereinigte Version mit einem Klick.",
    placeholder: "Fügen Sie Ihren Interview-Leitfaden oder Umfragefragen hier ein…Beispiel:1. Finden Sie nicht auch, dass unser Design intuitiv ist?2. Wie zufrieden sind Sie mit unserem großartigen Produkt?3. Wie alt sind Sie und wie hoch ist Ihr Einkommen?4. Warum haben Sie uns statt der schlechteren Konkurrenz gewählt?",
    analyze: "Bloom it",
    analyzing: "Your guide is blooming…",
    score: "Neutralitäts-Score",
    findings: "Ergebnisse",
    overview: "Gesamtbewertung",
    beforeAfter: "Vorher → Nachher",
    before: "Vorher",
    after: "Nachher",
    suggestion: "Warum es wichtig ist",
    noIssues: "Sieht gut aus! Keine schwerwiegenden Bias gefunden.",
    reset: "Alles löschen",
    copy: "Verbesserte Version kopieren",
    copied: "Kopiert!",
    original: "Ihr Original",
    improved: "Verbesserte Version",
    recs: "Empfehlungen",
    interview: "Interview",
    survey: "Umfrage",
    guideType: "Typ",
    detected: "Probleme gefunden",
    biasLabels: {
      leading: "Suggestiv",
      "double-barreled": "Doppelfrage",
      "assumption-loaded": "Annahme",
      jargon: "Fachjargon",
      "social-desirability": "Soz. Erwünschtheit",
      vague: "Vage",
      "order-bias": "Reihenfolge",
      framing: "Framing",
      hypothetical: "Hypothetisch",
      "validation-seeking": "Validierend",
      improvement: "Verbesserung",
      other: "Sonstige",
    },
  },
};

/* ─── Score Ring ─── */
function ScoreRing({ score, size = 120 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const t0 = Date.now();
    const tick = () => {
      const elapsed = Date.now() - t0;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (display / 100) * circ;
  const color = score >= 80 ? C.green : score >= 50 ? "#c49a1a" : C.red;

  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{}} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
        justifyContent:"center", flexDirection:"column" }}>
        <span style={{ fontSize:size*0.34, fontWeight:400, color:C.textDark, lineHeight:1,
          fontFamily:"'Instrument Serif', serif" }}>{display}</span>
        <span style={{ fontSize:8, color:C.textMid, marginTop:2, letterSpacing:2,
          textTransform:"uppercase", fontWeight:600, fontFamily:"'Outfit', sans-serif" }}>/100</span>
      </div>
    </div>
  );
}

/* ─── Bias Tag ─── */
function BiasTag({ type, lang }) {
  const s = BIAS_STYLE[type] || BIAS_STYLE.other;
  const label = T[lang].biasLabels[type] || type;
  const tip = BIAS_TOOLTIP[lang]?.[type] || BIAS_TOOLTIP.en?.[type] || "";
  return (
    <span title={tip} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px",
      borderRadius:99, fontSize:10, fontWeight:600, letterSpacing:0.4,
      background:s.bg, color:s.border, border:`1.5px solid ${s.border}30`,
      textTransform:"uppercase", whiteSpace:"nowrap", fontFamily:"'Outfit', sans-serif",
      cursor:"default", transition:"transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12) translateY(-2px)"; e.currentTarget.style.boxShadow=`0 4px 12px ${s.border}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="none"; }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.dot }} />
      {label}
    </span>
  );
}

/* ─── Finding Card ─── */
function FindingCard({ finding, index, lang, expanded, onToggle }) {
  const t = T[lang];
  const s = BIAS_STYLE[finding.type] || BIAS_STYLE.other;
  return (
    <div style={{ borderRadius:14, overflow:"hidden",
      background: expanded ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.55)",
      backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
      border: expanded ? `1.5px solid ${s.border}40` : "1.5px solid rgba(255,255,255,0.5)",
      transition:"all 0.3s ease",
      boxShadow: expanded ? `0 6px 24px ${s.border}15` : "0 1px 6px rgba(0,0,0,0.04)" }}>
      <button onClick={onToggle}
        style={{ width:"100%", display:"flex", alignItems:"center", gap:12,
          padding:"14px 16px", background:"none", border:"none", cursor:"pointer",
          textAlign:"left", fontFamily:"inherit" }}>
        <span style={{ display:"flex", alignItems:"center", justifyContent:"center",
          width:26, height:26, borderRadius:99, flexShrink:0,
          background:"rgba(255,255,255,0.7)", backdropFilter:"blur(8px)",
          border:`1.5px solid ${s.border}35`,
          color:s.border, fontSize:12, fontWeight:700,
          fontFamily:"'Instrument Serif', serif",
          boxShadow:"0 2px 6px rgba(0,0,0,0.06)" }}>{index + 1}</span>
        <span style={{ flex:1, fontSize:13.5, color:C.textDark, lineHeight:1.5,
          fontFamily:"'Outfit', sans-serif", fontWeight:400 }}>
          {finding.original}
        </span>
        <BiasTag type={finding.type} lang={lang} />
        {/* Severity dots */}
        <span style={{ display:"flex", gap:2, flexShrink:0 }} title={
          {minor:"Minor",major:"Major",critical:"Critical"}[BIAS_SEVERITY[finding.type]||"minor"]
        }>
          {Array.from({length:{minor:1,major:2,critical:3}[BIAS_SEVERITY[finding.type]||"minor"]}).map((_,i) => (
            <span key={i} style={{ width:4, height:4, borderRadius:"50%", background:s.border, opacity:0.7 }}/>
          ))}
        </span>
        <span style={{ fontSize:15, color:s.border, transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition:"transform 0.3s", flexShrink:0, opacity:0.7 }}>▾</span>
      </button>
      {expanded && (
        <div style={{ padding:"0 16px 16px 16px", animation:"fadeSlide 0.3s ease" }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:9, fontWeight:600, textTransform:"uppercase",
              color:s.border, letterSpacing:1.5, marginBottom:4,
              fontFamily:"'Outfit', sans-serif" }}>{t.suggestion}</div>
            <p style={{ fontSize:13, color:C.textBody, lineHeight:1.7, margin:0,
              fontFamily:"'Outfit', sans-serif" }}>
              {finding.explanation}
            </p>
          </div>
          <div className="bob-grid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ padding:14, borderRadius:14, background:C.redBg,
              border:`1px solid ${C.redBorder}` }}>
              <div style={{ fontSize:9, fontWeight:600, color:C.red, textTransform:"uppercase",
                letterSpacing:1.5, marginBottom:6, fontFamily:"'Outfit', sans-serif" }}>{t.before}</div>
              <p style={{ fontSize:13, color:C.textDark, margin:0, lineHeight:1.6,
                textDecoration:"line-through", textDecorationColor:`${C.red}44`,
                opacity:0.55, fontFamily:"'Outfit', sans-serif" }}>
                {finding.original}
              </p>
            </div>
            <div style={{ padding:14, borderRadius:14, background:C.greenBg,
              border:`1px solid ${C.greenBorder}` }}>
              <div style={{ fontSize:9, fontWeight:600, color:C.green, textTransform:"uppercase",
                letterSpacing:1.5, marginBottom:6, fontFamily:"'Outfit', sans-serif" }}>{t.after}</div>
              <p style={{ fontSize:13, color:"#0d4a28", margin:0, lineHeight:1.6,
                fontFamily:"'Outfit', sans-serif" }}>
                {finding.improved}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Logo Multi-Flower (logo1.svg) ─── */
function LogoFlower({ size = 48 }) {
  return (
    <svg width={size} height={size * 253/236} viewBox="0 0 236 253" fill="none">
      <path d="M100.595 58.141C95.5848 49.9192 93.3273 44.1355 94.6923 34.2708C96.2373 23.1234 103.64 9.45539 113.412 3.52159C118.782 0.220867 125.24 -0.814418 131.367 0.648402C136.79 1.94619 141.44 5.42699 144.215 10.2581C147.852 16.4844 148.055 21.1354 148.272 28.1419C164.427 20.4002 190.385 9.50042 200.682 30.7376C198.14 37.7966 195.77 45.2833 188.855 49.1091C186.215 50.5719 186.507 50.0768 185.855 52.2823C189.927 59.7764 230.697 61.3442 212.712 84.3817C233.6 108.995 209.397 118.762 190.512 129.999C207.372 141.252 229.925 155.085 234.26 176.292C238.077 194.956 227.802 204.191 211.002 207.941C217.557 218.301 217.722 226.418 204.875 231.144C199.587 250.056 189.71 247.205 175.347 239.253C151.79 243.424 142.58 235.825 152.862 213.08C153.035 212.69 150.2 208.639 149.832 207.994C150.522 194.618 154.482 197.409 160.625 189.615L159.53 188.542C155 189.427 150.005 197.649 147.11 201.873C134.915 209.704 132.71 210.387 118.437 212.285C124.797 222.855 125.862 228.338 112.595 233.379L112.64 244.497L108.537 251.346C80.4798 258.39 91.1148 230.409 65.3448 238.12C55.9998 240.911 37.8798 241.204 36.5973 228.338C34.7373 218.054 38.6899 215.15 45.2074 208.031C35.2024 201.01 20.3373 185.511 29.6673 172.121C32.4873 168.07 38.5698 166.067 43.4073 165.685C51.8673 164.979 60.2374 167.778 66.5749 173.419C67.5049 174.244 68.1349 174.927 68.9149 175.879C72.9199 167.14 76.3548 163.772 82.5273 156.668C65.5698 156.368 24.4173 157.058 24.0648 131.755C24.0423 130.014 25.1823 124.771 25.6173 122.94C9.61977 126.999 -8.54517 123.983 6.26733 104.179C-10.6077 89.6779 10.5348 81.5237 23.4273 79.1907C23.4348 76.355 23.5098 73.5344 23.6073 70.5262C24.0273 57.5334 36.3723 40.8647 48.9648 54.7653C50.6523 56.6257 52.6023 61.0892 53.8173 63.5573C61.6398 59.2138 65.6974 59.5138 74.7349 59.7689C78.9424 62.7696 80.0674 63.7973 83.6374 67.5406L100.595 58.141ZM105.95 39.2294C108.155 46.9186 110.367 50.9169 112.932 57.9535C115.197 58.006 117.53 58.066 119.772 58.3811C122.352 58.7337 128.442 61.8318 130.767 61.1266L130.85 60.2865C131.157 57.4583 131.052 56.9708 132.597 54.5777C142.392 46.8735 156.26 63.0621 139.07 66.7979C142.857 70.9163 145.272 73.4444 148.535 78.0579C151.227 81.8537 153.23 90.158 155.165 91.7184C157.857 91.6734 162.762 87.4575 165.005 85.6721C165.027 83.4891 164.735 79.4757 166.392 78.0429C172.167 73.0318 185.427 75.8149 192.785 75.9499L204.162 74.9823C192.425 67.8857 179.832 65.5827 167.465 60.1815C164.697 58.9738 158.817 53.8276 161.727 50.4969C166.355 45.2082 186.26 40.2796 187.332 32.5754C179.232 23.896 153.447 41.75 145.797 43.3628C126.057 47.5262 147.635 10.6406 123.822 12.426C110.277 16.9495 109.325 27.0092 105.95 39.2294ZM6.91982 95.3192C11.0448 95.5217 19.4974 95.5517 22.9849 96.962C28.2274 103.511 9.2823 109.415 10.7448 116.046C16.4373 119.257 31.2123 110.413 35.2323 105.656C37.2798 103.076 38.6599 100.683 41.6449 99.6251C48.2299 100.743 51.1098 111.98 62.3298 104.374C64.9998 98.9199 60.2673 94.674 61.9698 92.0784C63.3648 89.9555 70.9549 86.2047 74.4574 82.8289C83.6299 55.478 53.8623 79.0482 46.0548 69.2735C43.6248 66.2353 45.9573 59.2813 37.9098 58.5311L37.3398 59.2888C29.2773 70.1212 35.5548 75.5898 32.5923 86.8348C32.4048 87.5625 26.8173 88.5977 25.1973 88.8077C17.2548 89.8505 13.5798 90.6607 6.91982 95.3192ZM76.7748 92.3185C70.2948 96.497 71.9598 97.9522 72.2673 105.484L81.3498 106.182L82.9774 105.829C83.5624 103.083 79.7073 95.8218 78.3348 92.9562L76.7748 92.3185ZM173.922 200.027C171.215 200.822 166.887 201.527 165.492 203.358C167.435 206.434 169.812 208.721 168.86 212.097C167.42 217.206 162.14 222.322 161.307 227.281L162.237 228.406C173.72 229.149 173.855 223.102 184.947 231.091C187.7 232.584 187.587 233.072 190.482 232.989C192.702 230.709 191.022 226.41 193.092 223.53C195.612 220.019 199.61 221.549 201.822 218.234C199.715 214.288 196.55 212.045 194.585 207.551C192.627 206.839 174.357 200.027 173.922 200.027ZM105.792 67.3006C91.2423 71.0889 84.1773 77.3377 88.1073 93.3162C90.0198 101.065 98.5248 109.07 98.5623 116.519C97.2723 118.897 98.2023 118.139 95.8398 119.047C90.7023 118.559 83.6898 115.086 79.8198 114.988C66.6798 114.651 49.2648 116.399 38.3823 124.328C34.5123 127.149 31.0623 134.47 35.1573 138.199C44.3973 146.623 60.9948 146.653 72.8373 147.958C84.1173 148.521 91.9398 145.048 104.352 147.351C106.415 154.455 92.9223 159.908 88.1823 164.372C46.2798 203.815 128.645 217.273 145.22 190.08C148.475 184.746 148.805 177.155 151.4 172.946C152.832 172.946 155 172.624 155.952 173.516C171.095 187.724 191.18 203.92 213.425 197.979C216.02 197.289 220.07 195.879 221.945 193.658C236.03 173.164 209.9 152.587 194.42 143.247C188.15 139.466 174.8 132.512 182.18 124.643C188.622 118.739 212.007 112.468 211.632 101.185C210.995 82.0638 184.04 87.51 172.857 92.4986C166.16 95.2367 159.087 101.253 152.45 103.511C147.657 105.146 144.342 89.0703 142.917 85.8521C135.942 70.1737 121.34 66.4529 105.792 67.3006ZM100.22 212.12C81.7998 208.774 74.4048 205.383 67.2123 187.709C60.0048 183.681 54.2898 178.04 46.3023 178.512C42.9123 178.767 42.0948 178.287 39.5448 180.043C35.2623 192.27 62.2023 198.204 59.8923 209.592C58.6098 215.931 47.4273 221.594 49.3698 226.418C56.3748 229.659 69.9573 223.725 81.3198 223.912C86.6748 227.303 89.2848 230.521 93.2673 235.45C95.9223 237.85 97.3173 239.073 100.295 241.144C100.062 228.736 97.5723 226.605 109.062 220.327C104.96 217.333 103.377 216.178 100.22 212.12Z" fill="currentColor"/>
      <path d="M134.967 122.97C140.63 123.773 154.407 131.117 159.995 134.028C165.402 146.263 174.837 160.884 152.57 161.424C139.565 158.378 121.445 149.864 118.415 135.475C116.307 125.431 128.315 123.758 134.967 122.97ZM154.46 152.504C156.912 150.846 156.417 151.717 156.927 149.339C154.587 143.142 138.26 133.202 131.885 132.617L128.945 133.51C128.33 134.77 127.625 135.513 128.322 136.908C133.062 146.383 144.987 151.184 154.46 152.504Z" fill="currentColor"/>
      <path d="M50.5698 77.1578C52.3848 77.1053 55.3698 78.3656 56.9748 79.3108C60.1323 87.21 46.3323 93.6689 40.8573 95.8519C37.5573 95.9269 36.5298 95.6943 34.1223 93.5789C32.1798 85.7921 44.3223 79.1533 50.5698 77.1578Z" fill="currentColor"/>
      <path d="M73.8049 207.056C76.1299 206.553 78.4474 207.956 79.0849 210.252C79.7224 212.555 78.4549 214.948 76.1974 215.713C74.6149 216.253 72.8674 215.87 71.6599 214.723C70.4449 213.575 69.965 211.85 70.415 210.237C70.865 208.631 72.1699 207.409 73.8049 207.056Z" fill="currentColor"/>
      <path d="M180.35 213.62C183.087 212.697 186.065 214.093 187.107 216.786C188.15 219.479 186.89 222.517 184.242 223.68C182.42 224.475 180.312 224.212 178.752 222.99C177.192 221.767 176.42 219.786 176.757 217.828C177.087 215.871 178.467 214.258 180.35 213.62Z" fill="currentColor"/>
      <path d="M147.11 201.872C150.005 197.649 155 189.427 159.53 188.542L160.625 189.615C154.482 197.409 150.522 194.618 149.832 207.994L149.18 210.214L148.227 209.734L147.755 206.538L145.272 204.978C146.51 203.853 146.622 203.463 147.11 201.872Z" fill="currentColor"/>
    </svg>
  );
}

/* ─── Main App ─── */
export default function BiasDetector() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [lang, setLang] = useState("en");
  const [dark, setDark] = useState(false);
  const [guideType, setGuideType] = useState("interview");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(new Set([0]));
  const [copied, setCopied] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("findings");
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const t = T[lang];

  /* Theme colors based on dark mode */
  const tc = {
    cardBg: dark ? "rgba(30,30,48,0.85)" : "rgba(255,255,255,0.72)",
    cardBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
    cardShadow: dark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.07)",
    inputBg: dark ? "#1e1e30" : "#ffffff",
    textDark: dark ? "#e8e8f0" : C.textDark,
    textBody: dark ? "#c8c8d8" : C.textBody,
    textMid: dark ? "#9898b0" : C.textMid,
    textLight: dark ? "#686888" : C.textLight,
    divider: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    findingBg: dark ? "rgba(30,30,48,0.7)" : "rgba(255,255,255,0.55)",
    findingExpandedBg: dark ? "rgba(35,35,55,0.88)" : "rgba(255,255,255,0.82)",
    greenText: dark ? "#80E0A0" : "#0d4a28",
    pillBg: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    pillActive: dark ? "rgba(255,255,255,0.14)" : C.white,
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const toggleExpand = (i) => {
    const next = new Set(expanded);
    next.has(i) ? next.delete(i) : next.add(i);
    setExpanded(next);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    // ── Daily usage limit ──
    const LIMIT = 15;
    const today = new Date().toDateString();
    let usage = {};
    try { usage = JSON.parse(localStorage.getItem("bob_usage") || "{}"); } catch (e) { usage = {}; }
    if (usage.date !== today) { usage.date = today; usage.count = 0; }
    if (usage.count >= LIMIT) {
      const limitMsg = {
        en: `Daily limit of ${LIMIT} analyses reached. Please try again tomorrow.`,
        cs: `Denní limit ${LIMIT} analýz byl vyčerpán. Zkuste to prosím zítra.`,
        de: `Tageslimit von ${LIMIT} Analysen erreicht. Bitte versuchen Sie es morgen erneut.`,
      }[lang];
      setErrorMsg(limitMsg);
      return;
    }
    usage.count += 1;
    try { localStorage.setItem("bob_usage", JSON.stringify(usage)); } catch (e) {}
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 8) {
      setErrorMsg("Your text is too short to analyze. Please paste a complete interview guide or survey with actual questions.");
      return;
    }
    if (wordCount > 3000) {
      setErrorMsg(`Your guide has ~${wordCount} words. That\u2019s too long for a single analysis. Try splitting it into sections (max ~2500 words) and analyzing each part separately.`);
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    const langName = { en: "English", cs: "Czech", de: "German" }[lang];
    const typeName = guideType === "interview" ? "user interview guide" : "survey questionnaire";

    const systemPrompt = `You are a practical, friendly UX research assistant. Your job is to analyze user-submitted interview guides and survey questionnaires — find real problems, suggest better alternatives, and acknowledge what works well.

Be direct and helpful like Grammarly — short explanations, clear rewrites, no lecturing.

YOUR KNOWLEDGE BASE
Your analysis methodology is grounded in these experts and frameworks. Use their principles to evaluate and rewrite questions — but NEVER mention them by name in your responses. Your output should feel practical, not academic.

UX & Product Research:
- Steve Portigal (Interviewing Users) — focus on real experiences, open-ended exploration, proper interview structure
- Rob Fitzpatrick (The Mom Test) — avoid validation-seeking, focus on past behavior not hypotheticals, don’t pitch ideas disguised as questions
- Erika Hall (Just Enough Research) — right method for the right question, avoid unnecessary research theater
- Giff Constable (Talking to Humans) — concise guides, conversational flow, real stories over opinions
- Nielsen Norman Group — usability-focused question design, avoiding bias in moderated research
- IDEO — design research principles, empathy-driven questioning

Survey Methodology:
- Don Dillman (Internet, Phone, Mail and Mixed-Mode Surveys) — question order, visual design, respondent burden, structural flow
- Jon Krosnick — response scale design, acquiescence bias, satisficing, optimal question length
- Robert Groves (Survey Methodology) — measurement error, nonresponse, total survey error framework
- Pew Research Center — neutral wording, balanced scales, exhaustive/mutually exclusive options, question testing

Apply what these experts teach. Just don't talk about them.

BIAS TYPES TO DETECT
Flag questions with these issues:
- leading — suggests a desired answer
- double-barreled — asks two things at once
- assumption-loaded — assumes something not established
- jargon — uses language participants may not understand (context-dependent)
- social-desirability — pressures respondents toward "acceptable" answers
- vague — ambiguous terms like "often", "recently", "good", "easy"
- order-bias — question placement that contaminates later answers
- framing — positive/negative wording that skews responses
- hypothetical — asks about imagined future instead of real past behavior
- validation-seeking — asks participants to confirm an idea instead of exploring behavior
- improvement — NOT a bias, but a part of the guide that could be stronger. Use this for: informal greetings that should be a proper research introduction, weak closings that should be a proper wrap-up, missing consent/recording notices, missing context-setting, or any text that works but could be significantly more professional or effective.

The "improvement" type is important: if someone writes "Ahoj, jak se mas?" as their intro, don't flag it as a bias — but DO flag it as "improvement" and suggest a proper research introduction that sets context, explains the purpose, mentions recording/confidentiality, and puts the participant at ease. Same for weak closings — suggest a proper wrap-up.

Important: Don't over-flag. Only flag issues that meaningfully affect research quality. If a guide is generally well-written, say so.

STRUCTURAL CHECK — INTERVIEWS
Before flagging missing sections, carefully read the ENTIRE guide and recognize existing structure — even if informal. A casual "Hi, how are you?" IS a warm-up attempt (flag as "improvement" with a better version, not as missing). A "That's all, thank you" IS a wrap-up attempt (flag as "improvement" if it could be stronger).
A solid guide typically has: warm-up → context → real experiences → deep probing → wrap-up.
If a section is completely missing, mention it in recommendations. If it exists but is weak, flag it as "improvement" in findings with a rewrite.

QUESTION ORDERING — CRITICAL
Pay close attention to the order of questions. Flag as "order-bias" when:
- Questions about prior experience/behavior come AFTER showing a prototype or task (they should come BEFORE — to capture unbiased baseline)
- Opinion questions come before behavioral questions (behavior first, opinions after)
- Sensitive/demographic questions appear at the beginning (they should be at the end)
- Broad open questions come after narrow specific ones (funnel: broad → specific)
- A question primes or contaminates the answer to a later question
When flagging order-bias, explain WHY the order matters and suggest the correct sequence in the "explanation" field. The "improved" field must contain ONLY the rewritten question — never add meta-instructions like "[Move before X]" into the improved text.

STRUCTURAL CHECK — SURVEYS
Before flagging, recognize the existing flow. A solid survey typically has: screening → behavioral → attitudinal → demographics → optional open-ended. Flag clear structural problems in recommendations. Flag weak individual elements (like a missing intro text) as "improvement" in findings.

SCORING
- 90-100: Minor or no issues. Solid work.
- 80-89: Good questions, may have a few minor issues or structural gaps.
- 70-79: Decent questions with some real issues that need attention.
- 50-69: Multiple problems, needs revision.
- 30-49: Significant issues, major rework needed.
- 0-29: Deeply flawed.

IMPORTANT SCORING NUANCE: Distinguish between question quality and structural completeness. A guide with excellent questions but missing intro/outro is fundamentally different from a guide with poor questions. Score the QUESTIONS as the primary factor (70% weight), structure as secondary (30% weight). Example: great questions + no intro/outro = 80-85, not 70. Mediocre questions + perfect structure = 65-70, not higher.

Be fair and encouraging. A decent guide with a few leading questions is a 75, not a 40. An experienced researcher who forgot to add a formal intro should feel respected, not lectured.

TONE
- Start the overview by clearly separating what works from what could improve. Example: "Your questions are well-crafted and conversational — they do a great job of exploring real behavior. The main opportunity is adding a formal introduction and wrap-up to complete the guide."
- When flagging structural issues like missing intro/outro, frame them as "nice to have for completeness" not "critical failure." Use language like "Your guide would be even stronger with..." rather than "Your guide is missing..."
- For experienced-looking guides (good questions, natural flow), acknowledge the skill before suggesting improvements.
- Keep explanations to 1-2 sentences.
- Rewrites should feel natural and conversational.
- If the guide is good, say so and give a high score.

RECOMMENDATIONS RULES
Give exactly 3-5 recommendations. They MUST:
- Include any structural issues (missing sections, bad ordering, missing screening) that aren't already covered in findings
- Include a note about jargon being audience-dependent if any jargon was flagged
- Be specific to THIS guide — reference actual content from it
- NOT repeat what's already in findings
- NOT be generic advice like "use open-ended questions" unless the guide genuinely lacks them

OUTPUT
RESPOND ONLY IN ${langName}. Return ONLY valid JSON — no markdown, no backticks, no extra text.

CRITICAL RULES:
1. The "original" field must contain the EXACT text as it appears in the user's guide — copy it character by character, including any numbering like "1." or "2)". Do not rephrase, shorten, or clean up the original text. The "improved" field should keep the same numbering format if present.
2. NEVER flag the same question twice. If one question has multiple issues (e.g. it's both vague AND has order-bias), combine them into ONE finding. Use the most severe bias type, and mention the other issues in the explanation.
3. For order-bias: the "improved" field must contain ONLY the improved question text — no meta-instructions like "[Move this before...]". Put all ordering advice in the "explanation" field instead. Example explanation: "This question should come before the task section to capture unbiased baseline experience. Also consider making it more specific."

{"score":<0-100>,"overview":"<2-3 sentences: what works + main issues>","findings":[{"type":"<bias type>","original":"<exact text copied from guide>","improved":"<rewrite, keep same numbering>","explanation":"<1-2 sentences, practical>"}],"recommendations":["<structural + actionable tips>"]}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: `Analyze this ${typeName}:\n\n${text}` }],
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "API error");
      }
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const cleaned = raw.replace(/```json\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.score === 0 && (!parsed.findings || parsed.findings.length === 0)) {
        setResult(null);
        setErrorMsg(parsed.overview || "Not enough content to analyze. Please paste a complete guide with actual questions.");
      } else {
        setResult(parsed);
        setExpanded(new Set([0]));
        setActiveTab("findings");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setResult(null);
      const msg = err.message || "";
      if (msg.includes("too many tokens") || msg.includes("too long") || msg.includes("max_tokens") || msg.includes("context")) {
        setErrorMsg("Your guide is too long for a single analysis. Try splitting it into smaller sections and analyzing each part separately.");
      } else if (msg.includes("rate") || msg.includes("limit") || msg.includes("429")) {
        setErrorMsg("Too many requests right now. Please wait a moment and try again.");
      } else {
        setErrorMsg("Analysis failed \u2014 please try again. If this keeps happening, try a shorter text or check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (!result?.findings?.length) return;
    let improved = text;
    result.findings.forEach(f => {
      if (f.original && f.improved) {
        improved = improved.replace(f.original, f.improved);
      }
    });
    navigator.clipboard.writeText(improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => { setText(""); setResult(null); setExpanded(new Set([0])); setErrorMsg(""); };

  const handleExport = () => {
    if (!result) return;
    const sev = (type) => ({minor:"Minor",major:"Major",critical:"Critical"}[BIAS_SEVERITY[type]||"minor"]);
    let report = `BLOOM OVER BIAS — ANALYSIS REPORT\n${"═".repeat(40)}\n\n`;
    report += `Score: ${result.score}/100\n\n`;
    report += `Overview:\n${result.overview}\n\n`;
    if (result.findings?.length) {
      report += `${"─".repeat(40)}\nFINDINGS (${result.findings.length})\n${"─".repeat(40)}\n\n`;
      result.findings.forEach((f, i) => {
        const label = T[lang].biasLabels[f.type] || f.type;
        report += `${i+1}. [${label}] (${sev(f.type)})\n`;
        report += `   Original: ${f.original}\n`;
        report += `   Improved: ${f.improved}\n`;
        report += `   Why: ${f.explanation}\n\n`;
      });
    }
    if (result.recommendations?.length) {
      report += `${"─".repeat(40)}\nRECOMMENDATIONS\n${"─".repeat(40)}\n\n`;
      result.recommendations.forEach((r, i) => { report += `${i+1}. ${r}\n`; });
      report += "\n";
    }
    report += `${"─".repeat(40)}\nIMPROVED VERSION\n${"─".repeat(40)}\n\n`;
    let imp = text;
    result.findings?.forEach(f => { if(f.original && f.improved) imp = imp.replace(f.original, f.improved); });
    report += imp;
    const blob = new Blob([report], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bloom-over-bias-report.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Login screen ──
  if (!unlocked) {
    const tryUnlock = () => {
      if (pwInput === "hellosummer") setUnlocked(true); else setPwError(true);
    };
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", fontFamily:"'Outfit', sans-serif", padding:20,
        position:"relative", overflow:"hidden" }}>

        <style>{`
          @keyframes drift1{0%{transform:translate(0,0) rotate(8deg) scale(1)}33%{transform:translate(8vw,8vh) rotate(18deg) scale(1.15)}66%{transform:translate(-5vw,4vh) rotate(-4deg) scale(0.88)}100%{transform:translate(0,0) rotate(8deg) scale(1)}}
          @keyframes drift2{0%{transform:translate(0,0) rotate(5deg) scale(1)}33%{transform:translate(-9vw,7vh) rotate(-6deg) scale(1.18)}66%{transform:translate(6vw,-5vh) rotate(14deg) scale(0.85)}100%{transform:translate(0,0) rotate(5deg) scale(1)}}
          @keyframes drift3{0%{transform:translate(0,0) rotate(-6deg) scale(1)}33%{transform:translate(6vw,-8vh) rotate(8deg) scale(1.2)}66%{transform:translate(-7vw,6vh) rotate(-14deg) scale(0.9)}100%{transform:translate(0,0) rotate(-6deg) scale(1)}}
          @keyframes drift4{0%{transform:translate(0,0) rotate(0deg) scale(1)}33%{transform:translate(10vw,6vh) rotate(12deg) scale(1.2)}66%{transform:translate(-3vw,-7vh) rotate(-5deg) scale(0.85)}100%{transform:translate(0,0) rotate(0deg) scale(1)}}
        `}</style>

        {/* ── Flekatá animace na pozadí (stejná jako hlavní stránka) ── */}
        <div style={{position:"absolute",inset:0,zIndex:0}}>
          <div style={{position:"absolute",inset:0,background:"#7BAFD4"}} />
          <div style={{position:"absolute",inset:"-25%"}}>
            <div style={{position:"absolute",width:"90%",height:"70%",top:"-10%",left:"5%",
              borderRadius:"50%",
              background:"radial-gradient(ellipse at 55% 40%, #58B8F0 0%, #6AAEE8 40%, #88C0E0 70%, transparent 90%)",
              filter:"blur(35px)",animation:"drift1 8s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"65%",height:"55%",top:"-5%",left:"-10%",
              borderRadius:"42% 58% 38% 62% / 58% 42% 58% 42%",
              background:"radial-gradient(ellipse at 40% 45%, #F098B8 0%, #E8A0B0 35%, #E0B8B8 60%, transparent 82%)",
              filter:"blur(38px)",animation:"drift2 7s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"75%",height:"60%",top:"42%",left:"-8%",
              borderRadius:"52% 48% 58% 42%",
              background:"radial-gradient(ellipse at 45% 55%, #48A840 0%, #60B850 30%, #80C868 55%, #A0D080 75%, transparent 90%)",
              filter:"blur(35px)",animation:"drift3 9s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"60%",height:"50%",top:"48%",right:"-5%",
              borderRadius:"48% 52% 42% 58%",
              background:"radial-gradient(ellipse at 50% 50%, #E8D058 0%, #D8C860 35%, #C8C878 60%, transparent 85%)",
              filter:"blur(32px)",opacity:0.8,animation:"drift4 7s ease-in-out infinite"}}/>
            <div style={{position:"absolute",width:"55%",height:"45%",top:"22%",left:"18%",
              borderRadius:"50%",
              background:"radial-gradient(circle, #68B0D8 0%, #78B8B0 40%, #88C098 70%, transparent 88%)",
              filter:"blur(38px)",opacity:0.6,animation:"drift2 6s ease-in-out infinite reverse"}}/>
            <div style={{position:"absolute",width:"45%",height:"40%",top:"15%",right:"0%",
              borderRadius:"50%",
              background:"radial-gradient(circle, #F0A0B8 0%, #E8B0C0 35%, #D8C0D0 60%, transparent 82%)",
              filter:"blur(35px)",opacity:0.55,animation:"drift1 6s ease-in-out infinite reverse"}}/>
            <div style={{position:"absolute",width:"60%",height:"30%",top:"0%",left:"15%",
              borderRadius:"50%",
              background:"radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 40%, transparent 65%)",
              filter:"blur(30px)",animation:"drift4 10s ease-in-out infinite reverse"}}/>
          </div>
          {/* Jemný tmavý overlay pro lepší čitelnost karty */}
          <div style={{position:"absolute",inset:0,background:"rgba(20,30,50,0.18)"}}/>
        </div>

        {/* ── Login karta ── */}
        <div style={{ position:"relative", zIndex:1, background:"rgba(40,52,82,0.45)",
          backdropFilter:"blur(28px) saturate(1.4)", WebkitBackdropFilter:"blur(28px) saturate(1.4)",
          borderRadius:24, padding:"44px 38px", maxWidth:400, width:"100%",
          textAlign:"center", border:"1.5px solid rgba(255,255,255,0.25)",
          boxShadow:"0 12px 40px rgba(0,0,0,0.25)" }}>

          {/* Logo + nápis */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            gap:14, marginBottom:10 }}>
            <span style={{ color:"#ffffff", flexShrink:0,
              filter:"drop-shadow(0 2px 12px rgba(0,0,0,0.3))" }}>
              <LogoFlower size={52} />
            </span>
            <h1 style={{ fontFamily:"'Instrument Serif', serif", fontSize:36, fontWeight:400,
              color:"#ffffff", margin:0, letterSpacing:-1, lineHeight:1.05,
              textShadow:"0 3px 20px rgba(0,0,0,0.35)" }}>Bloom Over Bias</h1>
          </div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.82)", margin:"0 0 26px",
            fontFamily:"'Outfit', sans-serif", textShadow:"0 1px 8px rgba(0,0,0,0.2)" }}>
            Enter password to continue</p>

          <input type="password" value={pwInput} autoFocus
            onChange={e => { setPwInput(e.target.value); setPwError(false); }}
            onKeyDown={e => { if (e.key === "Enter") tryUnlock(); }}
            placeholder="Password"
            style={{ width:"100%", padding:"13px 16px", borderRadius:12,
              border: pwError ? "1.5px solid #ff8fa3" : "1.5px solid rgba(255,255,255,0.3)",
              background:"rgba(255,255,255,0.92)",
              fontSize:14, fontFamily:"'Outfit', sans-serif", outline:"none",
              color:"#111122", marginBottom:12, boxSizing:"border-box" }} />
          {pwError && <p style={{ fontSize:12, color:"#ffd0d8", margin:"0 0 12px",
            fontFamily:"'Outfit', sans-serif", fontWeight:500,
            textShadow:"0 1px 6px rgba(0,0,0,0.3)" }}>Incorrect password</p>}
          <button onClick={tryUnlock}
            style={{ width:"100%", padding:"13px", borderRadius:99, border:"none",
              background:"linear-gradient(135deg, #4898D8 0%, #58B080 50%, #A8C858 100%)",
              color:"white", fontSize:15, fontWeight:600,
              fontFamily:"'Outfit', sans-serif", cursor:"pointer",
              boxShadow:"0 6px 20px rgba(72,152,216,0.35)" }}>Enter</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh",
      fontFamily: "'Outfit', sans-serif", color: C.textDark, position:"relative", overflow:"hidden" }}
      onMouseMove={e => { setMouseX((e.clientX / window.innerWidth - 0.5) * 2); setMouseY((e.clientY / window.innerHeight - 0.5) * 2); }}>

      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 640px) {
          .bob-split { grid-template-columns: 1fr !important; }
          .bob-grid2 { grid-template-columns: 1fr !important; }
          .bob-wavy { display: none !important; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes drawFlower { to { stroke-dashoffset:0; } }
        @keyframes bloomSpin { 0%{transform:rotate(0deg) scale(0);opacity:0} 50%{opacity:1} 100%{transform:rotate(180deg) scale(1);opacity:1} }
        @keyframes drift1{0%{transform:translate(0,0) rotate(8deg) scale(1)}33%{transform:translate(8vw,8vh) rotate(18deg) scale(1.15)}66%{transform:translate(-5vw,4vh) rotate(-4deg) scale(0.88)}100%{transform:translate(0,0) rotate(8deg) scale(1)}}
        @keyframes drift2{0%{transform:translate(0,0) rotate(5deg) scale(1)}33%{transform:translate(-9vw,7vh) rotate(-6deg) scale(1.18)}66%{transform:translate(6vw,-5vh) rotate(14deg) scale(0.85)}100%{transform:translate(0,0) rotate(5deg) scale(1)}}
        @keyframes drift3{0%{transform:translate(0,0) rotate(-6deg) scale(1)}33%{transform:translate(6vw,-8vh) rotate(8deg) scale(1.2)}66%{transform:translate(-7vw,6vh) rotate(-14deg) scale(0.9)}100%{transform:translate(0,0) rotate(-6deg) scale(1)}}
        @keyframes drift4{0%{transform:translate(0,0) rotate(0deg) scale(1)}33%{transform:translate(10vw,6vh) rotate(12deg) scale(1.2)}66%{transform:translate(-3vw,-7vh) rotate(-5deg) scale(0.85)}100%{transform:translate(0,0) rotate(0deg) scale(1)}}
        textarea::placeholder { color: rgba(17,17,34,0.25); }
        textarea:focus { outline:none; border-color:rgba(80,100,180,0.5) !important; box-shadow:0 0 0 4px rgba(80,100,180,0.12); }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); border-radius:3px; }
        button { cursor:pointer; }
        button:active { transform:scale(0.98); }
      `}</style>

      {/* ═══ ANIMATED BACKGROUND ═══ */}
      <div style={{position:"fixed",inset:0,zIndex:0}}>
        <div style={{position:"absolute",inset:0,background:"#7BAFD4"}} />
        <div style={{position:"absolute",inset:"-25%",opacity: dark ? 0.4 : 1, transition:"opacity 0.5s",
          transform:`translate(${mouseX * 60}px, ${mouseY * 60}px)`,
          willChange:"transform", transition:"transform 0.3s ease-out, opacity 0.5s"}}>
        {/* Sky blue wash — top, dominant */}
        <div style={{position:"absolute",width:"90%",height:"70%",top:"-10%",left:"5%",
          borderRadius:"50%",
          background:"radial-gradient(ellipse at 55% 40%, #58B8F0 0%, #6AAEE8 40%, #88C0E0 70%, transparent 90%)",
          filter:"blur(35px)",animation:"drift1 8s ease-in-out infinite"}}/>
        {/* Soft pink-to-rose — top left */}
        <div style={{position:"absolute",width:"65%",height:"55%",top:"-5%",left:"-10%",
          borderRadius:"42% 58% 38% 62% / 58% 42% 58% 42%",
          background:"radial-gradient(ellipse at 40% 45%, #F098B8 0%, #E8A0B0 35%, #E0B8B8 60%, transparent 82%)",
          filter:"blur(38px)",animation:"drift2 7s ease-in-out infinite"}}/>
        {/* Grass green-to-teal — bottom left */}
        <div style={{position:"absolute",width:"75%",height:"60%",top:"42%",left:"-8%",
          borderRadius:"52% 48% 58% 42%",
          background:"radial-gradient(ellipse at 45% 55%, #48A840 0%, #60B850 30%, #80C868 55%, #A0D080 75%, transparent 90%)",
          filter:"blur(35px)",animation:"drift3 9s ease-in-out infinite"}}/>
        {/* Warm yellow-to-gold — bottom right */}
        <div style={{position:"absolute",width:"60%",height:"50%",top:"48%",right:"-5%",
          borderRadius:"48% 52% 42% 58%",
          background:"radial-gradient(ellipse at 50% 50%, #E8D058 0%, #D8C860 35%, #C8C878 60%, transparent 85%)",
          filter:"blur(32px)",opacity:0.8,animation:"drift4 7s ease-in-out infinite"}}/>
        {/* Blue-to-green transition — center */}
        <div style={{position:"absolute",width:"55%",height:"45%",top:"22%",left:"18%",
          borderRadius:"50%",
          background:"radial-gradient(circle, #68B0D8 0%, #78B8B0 40%, #88C098 70%, transparent 88%)",
          filter:"blur(38px)",opacity:0.6,animation:"drift2 6s ease-in-out infinite reverse"}}/>
        {/* Pink highlight — center right */}
        <div style={{position:"absolute",width:"45%",height:"40%",top:"15%",right:"0%",
          borderRadius:"50%",
          background:"radial-gradient(circle, #F0A0B8 0%, #E8B0C0 35%, #D8C0D0 60%, transparent 82%)",
          filter:"blur(35px)",opacity:0.55,animation:"drift1 6s ease-in-out infinite reverse"}}/>
        {/* White glow — top */}
        <div style={{position:"absolute",width:"60%",height:"30%",top:"0%",left:"15%",
          borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 40%, transparent 65%)",
          filter:"blur(30px)",animation:"drift4 10s ease-in-out infinite reverse"}}/>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{position:"relative",zIndex:1,maxWidth:1100,width:"92%",margin:"0 auto",padding:"0 0 60px"}}>

      {/* ─── Header ─── */}
      <header style={{ padding:"40px 0 32px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, marginBottom:14,
              padding:"5px 14px 5px 10px", borderRadius:99,
              background:"rgba(255,255,255,0.18)", backdropFilter:"blur(12px)",
              border:"1px solid rgba(255,255,255,0.25)" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#78E0A0",
                boxShadow:"0 0 8px rgba(120,224,160,0.6)" }}/>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:1.2,
                color:"rgba(255,255,255,0.9)", fontFamily:"'Outfit',sans-serif",
                textTransform:"uppercase" }}>UX Research Tool</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
              <span style={{ color:"#ffffff", flexShrink:0, filter:"drop-shadow(0 2px 12px rgba(0,0,0,0.3))" }}>
                <LogoFlower size={64} />
              </span>
              <h1 style={{ fontSize:"clamp(42px,7vw,64px)", fontWeight:400,
                fontFamily:"'Instrument Serif', serif", color:"#ffffff", margin:0,
                letterSpacing:-1.5, lineHeight:1.05,
                textShadow:"0 3px 20px rgba(0,0,0,0.35), 0 6px 40px rgba(0,0,0,0.2)" }}>
                {t.title}
              </h1>
            </div>
            <p style={{ fontSize:"clamp(16px,2vw,19px)", color:"rgba(255,255,255,0.92)",
              margin:"0 0 12px", fontWeight:300, fontFamily:"'Instrument Serif', serif",
              fontStyle:"italic", letterSpacing:0.2, lineHeight:1.4,
              textShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
              {t.subtitle}
            </p>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.72)", margin:0, lineHeight:1.75,
              maxWidth:500, textShadow:"0 1px 8px rgba(0,0,0,0.2)" }}>
              {t.desc}
            </p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center", alignSelf:"flex-start",
            marginTop:8, flexShrink:0 }}>
            <div style={{ display:"flex", background:"rgba(0,0,0,0.12)", borderRadius:99, padding:3,
              backdropFilter:"blur(12px)" }}>
              {["en","cs","de"].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{ padding:"5px 14px", borderRadius:99, border:"none",
                    background: lang===l ? "rgba(255,255,255,0.9)" : "transparent",
                    color: lang===l ? C.textDark : "rgba(255,255,255,0.8)",
                    fontSize:12, fontWeight: lang===l ? 600 : 400,
                    fontFamily:"'Outfit',sans-serif", transition:"all 0.25s",
                    boxShadow: lang===l ? "0 2px 8px rgba(0,0,0,0.1)" : "none" }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setDark(!dark)}
              style={{ width:36, height:36, borderRadius:99, border:"none",
                background:"rgba(0,0,0,0.12)", backdropFilter:"blur(12px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color: dark ? "#F0D060" : "rgba(255,255,255,0.85)", fontSize:16,
                transition:"all 0.3s" }}>
              {dark ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main style={{ padding:0 }}>

        {/* ─── Input Card (Glass) ─── */}
        <div style={{ background:tc.cardBg, backdropFilter:"blur(28px) saturate(1.4)",
          WebkitBackdropFilter:"blur(28px) saturate(1.4)", borderRadius:20,
          border:`1.5px solid ${tc.cardBorder}`,
          boxShadow:tc.cardShadow, marginBottom:20, overflow:"hidden" }}>

          {/* Top bar */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 24px",
            borderBottom:`1px solid ${tc.divider}` }}>
            <span style={{ fontSize:10, fontWeight:600, textTransform:"uppercase",
              letterSpacing:1.5, color:tc.textLight }}>{t.guideType}</span>
            <div style={{ display:"flex", background:tc.pillBg, borderRadius:99, padding:2 }}>
              {["interview","survey"].map(gt => (
                <button key={gt} onClick={() => setGuideType(gt)}
                  style={{ padding:"5px 14px", borderRadius:99, border:"none",
                    background: guideType===gt ? tc.pillActive : "transparent",
                    color: guideType===gt ? tc.textDark : tc.textLight,
                    fontSize:12, fontWeight: guideType===gt ? 500 : 400,
                    fontFamily:"'Outfit',sans-serif", transition:"all 0.2s",
                    boxShadow: guideType===gt ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
                  {t[gt]}
                </button>
              ))}
            </div>
            {!result && !loading && (
              <label style={{ display:"inline-flex", alignItems:"center", gap:5,
                padding:"5px 12px", borderRadius:99, fontSize:11, fontWeight:500,
                color:tc.textMid, background:tc.pillBg, cursor:"pointer",
                fontFamily:"'Outfit',sans-serif",
                boxShadow:"0 1px 4px rgba(0,0,0,0.07)" }}>
                <span style={{ fontSize:13, lineHeight:1 }}>+</span> Upload file
                <input type="file" accept=".txt,.md,.csv,.rtf" style={{ display:"none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => { if (ev.target?.result) setText(ev.target.result); };
                    reader.readAsText(file);
                    e.target.value = "";
                  }} />
              </label>
            )}
            <div style={{ flex:1 }}/>
            {result && (
              <button onClick={handleExport}
                style={{ padding:"5px 14px", borderRadius:99, background:tc.pillBg,
                  border:"none", fontSize:11, color:tc.textMid, fontWeight:500,
                  fontFamily:"'Outfit',sans-serif", display:"flex", alignItems:"center", gap:4 }}>
                ↓ Export</button>
            )}
            {text && !loading && (
              <button onClick={handleReset}
                style={{ padding:"5px 14px", borderRadius:99, background:tc.pillBg,
                  border:"none", fontSize:11, color:tc.textMid, fontWeight:500,
                  fontFamily:"'Outfit',sans-serif" }}>{t.reset}</button>
            )}
          </div>

          {/* Content area: editor / loading / split view */}
          {loading ? (
            <div style={{ padding:"60px 28px", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", background:tc.inputBg,
              borderBottomLeftRadius:20, borderBottomRightRadius:20, color:tc.textMid }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                {/* Flower 1 — Group_6 daisy */}
                <svg width="28" height="28" viewBox="0 0 250 225" fill="none"
                  style={{ animation:"bloomSpin 1s ease-out 0s forwards, float 3s ease-in-out 1s infinite" }}>
                  <path d="M79.57 0.127524C109.286 -2.95391 114.322 50.6353 117.945 71.352C128.125 48.5585 146.536 15.1732 175.321 13.2911C188.922 12.6666 197.24 25.4749 196.51 37.8332C194.959 63.9633 173.925 87.2138 156.103 104.366C174.561 101.293 184.919 100.412 205.456 103.585C229.749 105.607 270.017 140.796 238.098 161.322C210.5 179.073 160.727 160.281 133.044 153.69L136.97 162.749C143.766 181.063 146.769 204.144 130.212 218.705C119.349 228.262 103.754 225.222 95.1574 214.1C82.8054 198.136 84.5744 177.692 86.5141 158.825C67.6447 170.212 44.3995 186.097 21.2007 181.639C12.5031 179.968 9.74862 171.488 12.0995 163.652C16.4057 149.316 30.5034 138.847 42.8476 131.58C28.8896 130.12 2.88211 123.238 0.189811 106.675C-0.44641 102.757 0.531198 98.749 2.90539 95.5675C6.98651 89.9903 15.1643 86.7917 21.8446 85.9492C44.4848 83.0974 59.7385 87.4961 77.6691 100.414C75.0388 94.4821 72.0362 88.0555 69.8249 82.0105C61.8955 60.3932 54.5402 13.5409 79.57 0.127524Z"
                    stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:4000,strokeDashoffset:4000,animation:"drawFlower 1.8s ease-out 0s forwards"}}/>
                  <path d="M110.14 110.47C112.615 109.634 118.574 110.524 120.304 112.202C130.677 122.273 120.979 140.593 109.131 144.75C105.997 145.848 103.677 146.082 100.752 146.406C73.5183 142.671 82.9608 112.865 110.14 110.47Z"
                    stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:1000,strokeDashoffset:1000,animation:"drawFlower 1s ease-out 0.8s forwards"}}/>
                </svg>
                {/* Flower 2 — logo2 */}
                <svg width="36" height="30" viewBox="0 0 260 216" fill="none"
                  style={{ animation:"bloomSpin 1s ease-out 0.3s forwards, float 3s ease-in-out 1.3s infinite" }}>
                  <path d="M57.7914 51.3796C58.5609 32.7132 65.3184 6.26919 86.4211 0.447161C88.4131 -0.102709 92.7976 0.0090706 95.0071 0.00982076C110.486 8.7965 112.55 18.9177 116.974 34.9105C124.42 23.0991 130.187 12.3305 144.418 6.62626C179.022 -7.24653 222.967 10.9465 243.355 40.719C245.573 43.9567 247.997 53.2295 250 57.6577C244.301 71.4915 243.398 74.5356 229.422 80.6105L226.121 81.5497L226.211 82.3268C228.694 83.191 231.887 84.3035 234.209 85.5038C254.021 97.6002 257.78 104.761 259.866 126.609C249.686 147.069 233.96 144.366 214.694 138.453C226.871 151.872 247.649 161.039 253.59 180.856C257.259 193.094 247.565 201.133 236.517 202.775C204.899 207.48 178.803 186.039 154.239 170.379C160.266 182.99 164.279 188.566 163.892 202.724C154.079 215.651 146.408 216.864 130.378 214.368C108.718 210.994 84.6481 200.755 70.6921 183.378C65.7549 177.231 66.7269 171.706 68.0304 164.567C55.8534 164.206 -12.5435 164.798 2.02514 132.458C8.03924 119.107 37.9246 117.96 51.8926 114.779C48.1674 111.836 43.5751 109.541 39.3264 106.969C24.4231 97.949 -0.396464 79.0456 5.15324 59.029C9.67604 42.7152 31.0269 40.2531 44.6979 44.5433C50.0394 46.2199 52.9689 48.3114 57.7914 51.3796ZM107.221 97.8117C118.097 96.7637 125.201 101.692 116.332 111.798C115.625 111.992 114.91 112.161 114.19 112.303C111.391 112.836 108.459 112.973 106.082 111.195C104.621 110.123 103.692 108.475 103.532 106.671C103.218 103.247 105.158 100.282 107.221 97.8117Z"
                    stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:5000,strokeDashoffset:5000,animation:"drawFlower 2s ease-out 0.3s forwards"}}/>
                  <path d="M107.221 97.8117C118.097 96.7637 125.201 101.692 116.332 111.798C115.625 111.992 114.91 112.161 114.19 112.303C111.391 112.836 108.459 112.973 106.082 111.195C104.621 110.123 103.692 108.475 103.532 106.671C103.218 103.247 105.158 100.282 107.221 97.8117Z"
                    stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:800,strokeDashoffset:800,animation:"drawFlower 0.8s ease-out 1.2s forwards"}}/>
                </svg>
                {/* Flower 3 — Group_5 */}
                <svg width="32" height="20" viewBox="0 0 292 179" fill="none"
                  style={{ animation:"bloomSpin 1s ease-out 0.6s forwards, float 3s ease-in-out 1.6s infinite" }}>
                  <path d="M169.052 0.0740875C176.636 -0.564387 186.441 2.981 191.718 8.50152C203.506 20.835 201.098 40.2018 195.365 54.7456C194.193 57.7192 193.07 60.8673 193.008 64.0791C193.583 65.4119 193.331 65.5243 194.29 65.6423C200.897 66.4343 207.112 65.768 213.841 65.8432C239.351 66.1303 281.668 71.1775 290.389 100.304C296.66 121.245 276.764 138.3 257.978 142.373C239.374 146.406 224.568 144.508 208.037 134.766C194.481 168.528 155.996 183.859 121.114 176.872C108.394 174.324 93.8273 165.415 92.8985 151.424C92.7294 148.884 92.9917 144.31 91.7883 142.369C85.4649 143.803 79.0879 144.995 72.6729 145.943C55.2614 148.407 29.7327 149.459 14.5503 138.479C5.83562 132.176 3.6422 121.229 10.9347 112.761C22.6683 99.137 42.3097 95.7406 59.2417 94.1261C41.0551 89.8795 2.62193 82.5328 0.0995446 57.2009C-2.00852 36.0304 29.877 26.098 47.1892 25.4091C78.4563 24.1655 103.768 35.5347 126.877 56.2537C128.226 29.288 138.08 1.84832 169.052 0.0740875Z"
                    stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:5000,strokeDashoffset:5000,animation:"drawFlower 2s ease-out 0.6s forwards"}}/>
                  <path d="M130.008 73.0175C140.15 71.1463 162.091 73.7422 169.998 81.13C171.075 83.6777 171.068 82.621 170.105 85.0795C164.181 90.3316 148.942 91.0896 140.779 92.0244C130.796 92.2439 100.481 93.9297 96.3813 83.2541C98.1721 75.6366 123.756 73.4947 130.008 73.0175Z"
                    stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
                    style={{strokeDasharray:800,strokeDashoffset:800,animation:"drawFlower 0.8s ease-out 1.5s forwards"}}/>
                </svg>
              </div>
              <p style={{ fontSize:17, margin:0, fontWeight:400,
                fontFamily:"'Instrument Serif', serif", fontStyle:"italic",
                animation:"fadeSlide 0.5s ease 0.3s both" }}>{t.analyzing}</p>
            </div>
          ) : !result ? (
            <div style={{ position:"relative", background:tc.inputBg,
              borderBottomLeftRadius:20, borderBottomRightRadius:20 }}>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder={t.placeholder}
                style={{ width:"100%", minHeight:240, padding:"20px 24px 28px",
                  border:"none", background:"transparent",
                  fontSize:14, lineHeight:1.75, color:tc.textDark, resize:"vertical",
                  fontFamily:"'Outfit',sans-serif", outline:"none" }} />
              <div style={{ position:"absolute", bottom:8, right:24 }}>
                <span style={{ fontSize:11, color: text.trim().split(/\s+/).filter(Boolean).length > 2500
                  ? C.red : tc.textLight, fontFamily:"'Outfit',sans-serif" }}>
                  {text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0} words
                  {text.trim().split(/\s+/).filter(Boolean).length > 2500 && " (may be too long)"}
                </span>
              </div>
            </div>
          ) : (
            <div className="bob-split" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:240, position:"relative" }}>
              {/* Left: original */}
              <div style={{ padding:"20px 24px", background:tc.inputBg, overflow:"auto", maxHeight:420 }}>
                <div style={{ fontSize:9, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:1.5, color:tc.textLight, marginBottom:12,
                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>{t.original || "Original"}</span>
                  <button onClick={() => setResult(null)}
                    style={{ padding:"3px 10px", borderRadius:99, border:`1px solid ${tc.divider}`,
                      background:"transparent", color:tc.textLight, fontSize:10,
                      fontWeight:500, fontFamily:"'Outfit',sans-serif",
                      display:"flex", alignItems:"center", gap:4 }}>
                    ✎ {t.reset}
                  </button>
                </div>
                <pre style={{ fontSize:13, lineHeight:1.85, color:tc.textMid, margin:0,
                  fontFamily:"'Outfit',sans-serif", whiteSpace:"pre-wrap", wordBreak:"break-word",
                  opacity:0.5 }}>{text}</pre>
              </div>
              {/* Wavy Divider */}
              <svg className="bob-wavy" style={{ position:"absolute", left:"50%", top:0, width:24, height:"100%",
                transform:"translateX(-50%)", zIndex:2, overflow:"visible" }} preserveAspectRatio="none" viewBox="0 0 24 200">
                <path d="M12,0 Q4,25 12,50 Q20,75 12,100 Q4,125 12,150 Q20,175 12,200"
                  stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"} strokeWidth="1.5" fill="none"/>
              </svg>
              {/* Right: improved */}
              <div style={{ padding:"20px 24px",
                background: dark ? "rgba(30,30,48,0.5)" : "rgba(255,255,255,0.5)",
                overflow:"auto", maxHeight:420, borderBottomRightRadius:20 }}>
                <div style={{ fontSize:9, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:1.5, color:C.green, marginBottom:12,
                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span>{t.improved || "Improved"}</span>
                  <button onClick={handleCopyImproved}
                    style={{ padding:"4px 12px", borderRadius:99,
                      border:"none",
                      background: copied
                        ? "linear-gradient(135deg, #4898D8, #58B080)"
                        : "rgba(72,152,216,0.12)",
                      color: copied ? "white" : "#4898D8",
                      fontSize:10, fontWeight:600, fontFamily:"'Outfit',sans-serif",
                      display:"flex", alignItems:"center", gap:4, transition:"all 0.3s",
                      letterSpacing:0.3 }}>
                    {copied ? "✓" : "⧉"} {copied ? t.copied : "Copy"}
                  </button>
                </div>
                <div style={{ fontSize:13, lineHeight:1.7, color:tc.greenText,
                  fontFamily:"'Outfit',sans-serif" }}>
                  {(() => {
                    let imp = text;
                    result.findings?.forEach(f => {
                      if(f.original && f.improved) imp = imp.replace(f.original, f.improved);
                    });
                    return imp.split("\n").filter(l => l.trim()).map((line, i) => (
                      <div key={i} style={{ display:"flex", gap:10, marginBottom:12 }}>
                        <span style={{ color:C.green, flexShrink:0, marginTop:1, fontSize:8 }}>●</span>
                        <span>{line.replace(/^\d+[\.\)]\s*/, "")}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMsg && !loading && !result && (
          <div style={{ padding:"12px 20px", borderRadius:14, marginBottom:12,
            background:"rgba(184,48,74,0.08)", border:"1px solid rgba(184,48,74,0.15)",
            color:C.red, fontSize:13, fontFamily:"'Outfit',sans-serif",
            display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:16 }}>!</span>
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")}
              style={{ marginLeft:"auto", background:"none", border:"none",
                color:C.red, opacity:0.5, cursor:"pointer", fontSize:14 }}>✕</button>
          </div>
        )}

        {/* Analyze Button — only in editor mode */}
        {!result && !loading && (
        <button onClick={handleAnalyze} disabled={!text.trim()}
          onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
          style={{ width:"100%", padding:"16px 24px", borderRadius:99, border:"none",
            background: !text.trim() ? (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)")
              : "linear-gradient(135deg, #4898D8 0%, #58B080 50%, #A8C858 100%)",
            color: !text.trim() ? tc.textLight : "white",
            fontSize:17, fontWeight:600, fontFamily:"'Outfit',sans-serif",
            letterSpacing:0.3, transition:"all 0.35s",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            position:"relative", overflow:"hidden",
            transform: btnHover && text.trim() ? "scale(1.02)" : "scale(1)",
            boxShadow: !text.trim() ? "none"
              : btnHover ? "0 8px 36px rgba(72,152,216,0.45), 0 4px 16px rgba(88,176,128,0.3)"
              : "0 6px 28px rgba(72,152,216,0.35), 0 3px 12px rgba(88,176,128,0.25)" }}>
          {/* Inline flower */}
          <svg width="28" height="28" viewBox="0 0 250 225" fill="none"
            style={{ position:"absolute", left:"calc(50% - 70px)",
              opacity: btnHover ? 1 : 0, transition:"all 0.4s cubic-bezier(.34,1.56,.64,1)",
              transform: btnHover ? "rotate(180deg) scale(1)" : "rotate(0deg) scale(0)" }}>
            <path d="M79.57 0.127524C109.286 -2.95391 114.322 50.6353 117.945 71.352C128.125 48.5585 146.536 15.1732 175.321 13.2911C188.922 12.6666 197.24 25.4749 196.51 37.8332C194.959 63.9633 173.925 87.2138 156.103 104.366C174.561 101.293 184.919 100.412 205.456 103.585C229.749 105.607 270.017 140.796 238.098 161.322C210.5 179.073 160.727 160.281 133.044 153.69L136.97 162.749C143.766 181.063 146.769 204.144 130.212 218.705C119.349 228.262 103.754 225.222 95.1574 214.1C82.8054 198.136 84.5744 177.692 86.5141 158.825C67.6447 170.212 44.3995 186.097 21.2007 181.639C12.5031 179.968 9.74862 171.488 12.0995 163.652C16.4057 149.316 30.5034 138.847 42.8476 131.58C28.8896 130.12 2.88211 123.238 0.189811 106.675C-0.44641 102.757 0.531198 98.749 2.90539 95.5675C6.98651 89.9903 15.1643 86.7917 21.8446 85.9492C44.4848 83.0974 59.7385 87.4961 77.6691 100.414C75.0388 94.4821 72.0362 88.0555 69.8249 82.0105C61.8955 60.3932 54.5402 13.5409 79.57 0.127524Z"
              stroke="white" strokeWidth="8" fill="none"/>
            <path d="M110.14 110.47C112.615 109.634 118.574 110.524 120.304 112.202C130.677 122.273 120.979 140.593 109.131 144.75C105.997 145.848 103.677 146.082 100.752 146.406C73.5183 142.671 82.9608 112.865 110.14 110.47Z"
              stroke="white" strokeWidth="8" fill="none"/>
          </svg>
          {t.analyze}
        </button>
        )}

        {/* ─── Results ─── */}
        {result && (
          <div style={{ marginTop:28, animation:"fadeSlide 0.5s ease" }}>

            {/* Score + Overview Card */}
            <div style={{ display:"flex", gap:24, marginBottom:24, alignItems:"center",
              background:tc.cardBg, backdropFilter:"blur(28px) saturate(1.4)",
              WebkitBackdropFilter:"blur(28px) saturate(1.4)", borderRadius:20,
              padding:"24px 28px", border:`1.5px solid ${tc.cardBorder}`,
              boxShadow:tc.cardShadow, flexWrap:"wrap" }}>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <ScoreRing score={result.score} size={110} />
                <div style={{ fontSize:9, fontWeight:600, textTransform:"uppercase",
                  letterSpacing:2, color:tc.textLight, marginTop:6 }}>{t.score}</div>
              </div>
              <div style={{ flex:1, minWidth:220 }}>
                <p style={{ fontSize:14, lineHeight:1.75, color:tc.textBody, margin:"0 0 6px" }}>
                  {result.overview}</p>
                <span style={{ fontSize:12, color:tc.textMid, fontWeight:600 }}>
                  {result.findings?.length || 0} {t.detected}
                </span>
              </div>
            </div>

            {/* Bias Summary Bar */}
            {result.findings?.length > 0 && (() => {
              const counts = {};
              result.findings.forEach(f => { counts[f.type] = (counts[f.type]||0) + 1; });
              return (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
                  {Object.entries(counts).map(([type, count]) => {
                    const s = BIAS_STYLE[type] || BIAS_STYLE.other;
                    const label = T[lang].biasLabels[type] || type;
                    return (
                      <span key={type} style={{ display:"inline-flex", alignItems:"center", gap:5,
                        padding:"5px 14px", borderRadius:99, fontSize:11, fontWeight:500,
                        background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)",
                        color:tc.textDark, border:"1px solid rgba(255,255,255,0.5)",
                        fontFamily:"'Outfit',sans-serif",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot,
                          boxShadow:`0 0 6px ${s.dot}55` }}/>
                        {label} <span style={{ fontWeight:700, color:s.border }}>{count}</span>
                      </span>
                    );
                  })}
                </div>
              );
            })()}

            {/* Tab Navigation */}
            <div style={{ display:"flex", marginBottom:16, background:"rgba(0,0,0,0.08)",
              borderRadius:99, padding:3, width:"fit-content", backdropFilter:"blur(12px)" }}>
              {["findings","recs"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding:"6px 16px", borderRadius:99, border:"none",
                    background: activeTab===tab ? "rgba(255,255,255,0.9)" : "transparent",
                    color: activeTab===tab ? C.textDark : "rgba(255,255,255,0.8)",
                    fontSize:12, fontWeight: activeTab===tab ? 600 : 400,
                    fontFamily:"'Outfit',sans-serif",
                    boxShadow: activeTab===tab ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                    transition:"all 0.25s" }}>
                  {tab==="findings" ? t.findings : t.recs}
                </button>
              ))}
            </div>

            {/* ─ Findings Tab ─ */}
            {activeTab==="findings" && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {result.findings?.length > 0 ? result.findings.map((f,i) => (
                  <div key={i} style={{ animation:"fadeSlide 0.4s ease both",
                    animationDelay:`${i * 80}ms` }}>
                    <FindingCard finding={f} index={i} lang={lang}
                      expanded={expanded.has(i)} onToggle={() => toggleExpand(i)} />
                  </div>
                )) : (
                  <div style={{ textAlign:"center", padding:"40px 20px", color:C.green,
                    background:"rgba(255,255,255,0.6)", backdropFilter:"blur(20px)",
                    borderRadius:16, fontSize:15, fontWeight:500,
                    border:"1.5px solid rgba(255,255,255,0.5)" }}>
                    ✓ {t.noIssues}
                  </div>
                )}
              </div>
            )}


            {/* ─ Recommendations Tab ─ */}
            {activeTab==="recs" && (
              <div style={{ background:tc.cardBg, backdropFilter:"blur(28px) saturate(1.4)",
                WebkitBackdropFilter:"blur(28px) saturate(1.4)", borderRadius:20,
                padding:"22px 24px", border:`1.5px solid ${tc.cardBorder}`,
                boxShadow:tc.cardShadow }}>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {result.recommendations?.map((rec,i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start",
                      animation:"fadeSlide 0.3s ease", animationDelay:`${i*80}ms`,
                      animationFillMode:"both" }}>
                      <span style={{ width:24, height:24, borderRadius:99,
                        background:"linear-gradient(135deg, #4898D8, #58B080)",
                        color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:400, flexShrink:0,
                        fontFamily:"'Instrument Serif', serif",
                        boxShadow:"0 2px 8px rgba(72,152,216,0.3)" }}>{i+1}</span>
                      <p style={{ fontSize:13, color:tc.textBody, margin:0,
                        lineHeight:1.7 }}>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer style={{ padding:"40px 0 28px", display:"flex", alignItems:"center",
        justifyContent:"center", gap:8, flexWrap:"wrap", fontSize:12,
        color:"rgba(255,255,255,0.55)", fontFamily:"'Outfit',sans-serif" }}>
        <button onClick={() => setShowMethodology(true)}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,0.65)",
            fontSize:12, fontFamily:"'Outfit',sans-serif", cursor:"pointer",
            textDecoration:"underline", textDecorationColor:"rgba(255,255,255,0.25)",
            textUnderlineOffset:3 }}>
          What’s behind the analysis?
        </button>
        <span style={{ opacity:0.3 }}>·</span>
        <a href="https://www.linkedin.com/in/anna-kutikova/" target="_blank" rel="noopener noreferrer"
          style={{ color:"rgba(255,255,255,0.85)", textDecoration:"underline",
            textDecorationColor:"rgba(255,255,255,0.35)", textUnderlineOffset:3, fontWeight:400 }}>
          vibecoded by Anna Kutíková ✳
        </a>
        <span style={{ opacity:0.3 }}>·</span>
        <a href="https://www.linkedin.com/in/anna-kutikova/" target="_blank" rel="noopener noreferrer"
          style={{ color:"rgba(255,255,255,0.65)", textDecoration:"underline",
            textDecorationColor:"rgba(255,255,255,0.25)", textUnderlineOffset:3 }}>
          Got feedback? Let’s talk
        </a>
      </footer>

      {showMethodology && (
        <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex",
          alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={() => setShowMethodology(false)}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)",
            backdropFilter:"blur(8px)" }}/>
          <div onClick={e => e.stopPropagation()}
            style={{ position:"relative", maxWidth:620, width:"100%", maxHeight:"85vh",
              overflow:"auto", background:tc.cardBg, backdropFilter:"blur(28px) saturate(1.4)",
              WebkitBackdropFilter:"blur(28px) saturate(1.4)", borderRadius:20,
              border:`1.5px solid ${tc.cardBorder}`, boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
              padding:"36px 32px", animation:"fadeSlide 0.3s ease",
              fontFamily:"'Outfit',sans-serif", fontSize:13, color:tc.textBody, lineHeight:1.8 }}>
            <button onClick={() => setShowMethodology(false)}
              style={{ position:"absolute", top:16, right:16, background:"none", border:"none",
                color:tc.textLight, fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>

            <h2 style={{ fontSize:26, fontFamily:"'Instrument Serif', serif", fontWeight:400,
              color:tc.textDark, margin:"0 0 4px" }}>The Research Behind the Tool</h2>
            <p style={{ fontSize:13, color:tc.textLight, margin:"0 0 28px",
              fontStyle:"italic", fontFamily:"'Instrument Serif', serif" }}>
              Bloom Over Bias is grounded in established UX research and survey methodology. Here’s what powers every analysis.
            </p>

            <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1.5,
              color:tc.textLight, marginBottom:10 }}>How We Evaluate Questions</div>

            <div style={{ margin:"0 0 16px", paddingLeft:12, borderLeft:"2px solid rgba(72,152,216,0.2)" }}>
              <span style={{ fontWeight:600, color:tc.textDark }}>Real behavior over hypotheticals</span>
              <div style={{ fontSize:12, color:tc.textMid, marginTop:3, lineHeight:1.7 }}>Good research questions ask about what people actually did, not what they would do. We flag hypothetical and validation-seeking questions and rewrite them to uncover real past behavior. Based on principles from <a href="https://www.momtestbook.com/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>The Mom Test</a> (Rob Fitzpatrick) and <a href="https://portigal.com/Books/interviewing-users/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Interviewing Users</a> (Steve Portigal).</div>
            </div>
            <div style={{ margin:"0 0 16px", paddingLeft:12, borderLeft:"2px solid rgba(72,152,216,0.2)" }}>
              <span style={{ fontWeight:600, color:tc.textDark }}>Neutral, unbiased wording</span>
              <div style={{ fontSize:12, color:tc.textMid, marginTop:3, lineHeight:1.7 }}>Leading language, loaded assumptions, and social desirability cues silently corrupt your data. We detect framing effects, double-barreled questions, and suggestive wording. Informed by <a href="https://www.pewresearch.org/methods/u-s-survey-research/questionnaire-design/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Pew Research Center’s questionnaire design</a> and <a href="https://scholar.google.com/citations?user=NcBwMnMAAAAJ" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Jon Krosnick’s</a> work on response bias and satisficing.</div>
            </div>
            <div style={{ margin:"0 0 16px", paddingLeft:12, borderLeft:"2px solid rgba(72,152,216,0.2)" }}>
              <span style={{ fontWeight:600, color:tc.textDark }}>Question order matters</span>
              <div style={{ fontSize:12, color:tc.textMid, marginTop:3, lineHeight:1.7 }}>The sequence of questions shapes how participants think and respond. We check that behavioral questions come before prototype exposure, that broad questions precede narrow ones, and that sensitive topics are placed appropriately. Grounded in <a href="https://www.wiley.com/en-us/Internet+Phone+Mail+and+Mixed+Mode+Surveys-p-9781118921302" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Dillman’s survey design</a> and <a href="https://www.wiley.com/en-us/Survey+Methodology-p-9780470465462" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Groves’ total survey error framework</a>.</div>
            </div>
            <div style={{ margin:"0 0 16px", paddingLeft:12, borderLeft:"2px solid rgba(72,152,216,0.2)" }}>
              <span style={{ fontWeight:600, color:tc.textDark }}>Purposeful structure</span>
              <div style={{ fontSize:12, color:tc.textMid, marginTop:3, lineHeight:1.7 }}>A strong interview guide has a clear arc: warm-up, context, exploration, deep probing, and wrap-up. Surveys need screening, behavioral, attitudinal, and demographic sections in the right order. We flag missing or weak sections and suggest improvements. Drawing on <a href="https://abookapart.com/products/just-enough-research" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Erika Hall</a>, <a href="https://www.talkingtohumans.com/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>Giff Constable</a>, and <a href="https://www.nngroup.com/topic/user-interviews/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>NNG research practices</a>.</div>
            </div>
            <div style={{ margin:"0 0 16px", paddingLeft:12, borderLeft:"2px solid rgba(72,152,216,0.2)" }}>
              <span style={{ fontWeight:600, color:tc.textDark }}>Empathy-first approach</span>
              <div style={{ fontSize:12, color:tc.textMid, marginTop:3, lineHeight:1.7 }}>Research is a conversation, not an interrogation. We evaluate whether questions build rapport, use accessible language, and create space for honest answers. Inspired by <a href="https://designthinking.ideo.com/" target="_blank" rel="noopener noreferrer" style={{ color:"#4898D8", textDecoration:"underline", textUnderlineOffset:2 }}>IDEO’s human-centered design</a> principles and contextual inquiry methods.</div>
            </div>

            <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1.5,
              color:tc.textLight, marginBottom:12, marginTop:22 }}>What We Detect</div>
            <div className="bob-grid2" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
              {[
                { label:"Leading", color:"#C85A2A", desc:"Suggests a desired answer through wording" },
                { label:"Double-barreled", color:"#B8304A", desc:"Asks two things in one question" },
                { label:"Assumptions", color:"#8B5E3C", desc:"Presumes something not yet established" },
                { label:"Jargon", color:"#6A7A3A", desc:"Language your participants may not understand" },
                { label:"Social desirability", color:"#A0522D", desc:"Pressures toward ‘acceptable’ answers" },
                { label:"Vague", color:"#5A5A70", desc:"Ambiguous terms like ‘often’ or ‘easy’" },
                { label:"Order bias", color:"#4A6A8A", desc:"Placement contaminates later responses" },
                { label:"Framing", color:"#6A5A8A", desc:"Wording skews how people respond" },
                { label:"Hypothetical", color:"#7A6A4A", desc:"Imagined future instead of real behavior" },
                { label:"Validation-seeking", color:"#8A4A6A", desc:"Confirms an idea instead of exploring" },
                { label:"Structural", color:"#4898D8", desc:"Missing warm-up, weak closing, no consent" },
                { label:"Question flow", color:"#58B080", desc:"Wrong order: broad → specific, behavior → opinion" },
              ].map(b => (
                <div key={b.label} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 10px",
                  borderRadius:10, background:dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)" }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:b.color, marginTop:5, flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:tc.textDark, lineHeight:1.3 }}>{b.label}</div>
                    <div style={{ fontSize:11, color:tc.textMid, lineHeight:1.4, marginTop:1 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop:16, borderTop:`1px solid ${tc.divider}`,
              fontSize:11, color:tc.textLight, fontStyle:"italic", lineHeight:1.7 }}>
              Powered by Claude AI (Anthropic) · This tool applies research principles automatically — it’s
              designed to support researchers, not replace critical thinking. Always review suggestions
              in the context of your specific research goals.
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
