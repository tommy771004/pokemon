import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from "recharts";
import Seo from "../components/Seo";
import GuideDiagram from "../components/GuideDiagram";
import ScrollFade from "../components/ScrollFade";

function GuideDataChart({ en }: { en: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"encounter" | "resource">("encounter");

  const encounterData = en ? [
    { name: "Wasteland", Common: 65, Rare: 30, Legendary: 5 },
    { name: "Beach", Common: 55, Rare: 35, Legendary: 10 },
    { name: "Ridges", Common: 50, Rare: 40, Legendary: 10 },
    { name: "Skylands", Common: 40, Rare: 45, Legendary: 15 },
    { name: "Empty Town", Common: 30, Rare: 50, Legendary: 20 },
  ] : [
    { name: "乾巴巴荒野", Common: 65, Rare: 30, Legendary: 5 },
    { name: "暗沉沉海邊", Common: 55, Rare: 35, Legendary: 10 },
    { name: "凸隆隆山地", Common: 50, Rare: 40, Legendary: 10 },
    { name: "閃閃浮島", Common: 40, Rare: 45, Legendary: 15 },
    { name: "調色板鎮", Common: 30, Rare: 50, Legendary: 20 },
  ];

  const resourceData = en ? [
    { name: "Wasteland", Lumber: 30, Brick: 85, Metals: 40 },
    { name: "Beach", Lumber: 20, Brick: 75, Metals: 50 },
    { name: "Ridges", Lumber: 10, Brick: 30, Metals: 95 },
    { name: "Skylands", Lumber: 60, Brick: 40, Metals: 80 },
    { name: "Empty Town", Lumber: 90, Brick: 80, Metals: 85 },
  ] : [
    { name: "乾巴巴荒野", Lumber: 30, Brick: 85, Metals: 40 },
    { name: "暗沉沉海邊", Lumber: 20, Brick: 75, Metals: 50 },
    { name: "凸隆隆山地", Lumber: 10, Brick: 30, Metals: 95 },
    { name: "閃閃浮島", Lumber: 60, Brick: 40, Metals: 80 },
    { name: "調色板鎮", Lumber: 90, Brick: 80, Metals: 85 },
  ];

  const colors = {
    Common: "#5c6238",     // Tertiary (Olive Green)
    Rare: "#a53a2c",       // Primary (Warm Coral Red)
    Legendary: "#d29910",  // Gold / Yellow
    Lumber: "#8b716d",     // Copper / Brown-Grey
    Brick: "#a53a2c",      // Terracotta
    Metals: "#795900",     // Secondary Bronze
  };

  return (
    <div className="mb-8 bg-paper border hairline-border p-6 sm:p-8 tracking-wide select-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-base text-ink-soft m-0 group-hover:text-ink-main transition-colors flex items-center gap-2">
              {en ? "Eco-Metrics Database Analyzer" : "區域生態與物資產出智慧數據分析儀"}
              <span className="font-mono-metadata text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-sm uppercase tracking-wider font-bold">
                PRO TOOL
              </span>
            </h3>
            <p className="font-mono-metadata text-ink-mute text-xs m-0 mt-0.5 leading-tight">
              {en 
                ? "Compare Pokémon encounter distribution and refinery resource efficiency across regions" 
                : "跨區域對比普通/稀有/傳說遭遇分佈，與木材/磚塊/高階金屬三大資產的產出權重評分"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-ink-mute pl-4">
          <span className="font-mono-metadata text-xs uppercase tracking-widest hidden sm:inline-block">
            {isOpen 
              ? (en ? "COLLAPSE" : "收合統計圖表") 
              : (en ? "EXPAND" : "展開統計圖表")}
          </span>
          <motion.span 
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="material-symbols-outlined text-[20px]"
          >
            expand_more
          </motion.span>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden border-t border-line-soft pt-4"
          >
            {/* Tab switchers */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab("encounter")}
                className={`font-mono-metadata text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all ${
                  activeTab === "encounter"
                    ? "bg-primary text-on-primary border-primary cursor-pointer"
                    : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary cursor-pointer"
                }`}
              >
                📊 {en ? "Encounter Probabilities (%)" : "遭遇機率對比 (%)"}
              </button>
              <button
                onClick={() => setActiveTab("resource")}
                className={`font-mono-metadata text-xs uppercase tracking-wider px-4 py-2 rounded-sm border transition-all ${
                  activeTab === "resource"
                    ? "bg-primary text-on-primary border-primary cursor-pointer"
                    : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary cursor-pointer"
                }`}
              >
                ⚒️ {en ? "Refining Resource Weights" : "精煉物資產出權重"}
              </button>
            </div>

            {/* Explanatory subtitle */}
            <p className="font-body-italic text-sm text-ink-mute mb-6 max-w-3xl leading-relaxed">
              {activeTab === "encounter"
                ? (en 
                    ? "Shows the probability of encounters in regular habitats. In Empty Town, the environment's micro-climate elevates rare migrations by up to 50% compared to starting regions."
                    : "資料反映常規棲地的原生出沒分佈。隨著環境修復與等級提高，終局「調色板鎮」的稀有與傳說個體移民比率可比初期荒地提高數倍。")
                : (en
                    ? "Evaluates resource yield potentials on a 0-100 efficiency matrix. Perfect for optimizing colony placement of production trio specialists (Wooper/Timburr/Scyther)."
                    : "依據 0-100 的基礎效率矩陣，評估各區域採掘及精煉效率。這能極佳輔助玩家調遣「烏波（黏土）、飛天螳螂（木材）與修建老匠（混凝土）」至最匹配的區域打工。")
              }
            </p>

            {/* Recharts container */}
            <div className="w-full h-[320px] bg-paper-warm/40 p-2 sm:p-4 rounded-sm border border-line-soft font-mono-metadata text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(activeTab === "encounter" ? encounterData : resourceData) as any[]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(21, 20, 15, 0.05)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#5A5448" }} 
                    axisLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                    tickLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: "#5A5448" }}
                    axisLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                    tickLine={{ stroke: "rgba(21, 20, 15, 0.15)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#F7F1DE", 
                      borderColor: "rgba(21, 20, 15, 0.15)",
                      borderRadius: "2px",
                      color: "#2A2620"
                    }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: 10 }} />
                  {activeTab === "encounter" ? (
                    <>
                      <Bar dataKey="Common" name={en ? "Common" : "普通級"} fill={colors.Common} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Rare" name={en ? "Rare" : "稀有級"} fill={colors.Rare} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Legendary" name={en ? "Legendary" : "傳說級"} fill={colors.Legendary} radius={[2, 2, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="Lumber" name={en ? "Lumbering" : "木材採伐效率"} fill={colors.Lumber} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Brick" name={en ? "Clay/Brick Clay" : "黏土燒製效率"} fill={colors.Brick} radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Metals" name={en ? "Metal Mining/Refining" : "金屬冶煉效率"} fill={colors.Metals} radius={[2, 2, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-ink-faint font-mono-metadata uppercase">
              <span>* Data Normalized to 100% Core Index</span>
              <span>Source: GameWith DB Analytics</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DocumentArchiveCard({ section, en, index }: { section: any; en: boolean; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const title = en ? section.titleEn : section.titleZh;
  const content = en ? section.contentEn : section.contentZh;

  return (
    <div className="mb-8">
      <div 
        onClick={() => setIsOpen(true)} 
        className="cursor-pointer group border hairline-border bg-paper p-6 w-full max-w-[500px] mx-auto overflow-hidden transition-colors hover:bg-bone"
      >
        <div className="absolute top-2 right-2 font-mono-metadata text-xs text-ink-mute bg-paper/80 px-2 py-0.5 rounded-sm backdrop-blur-sm z-10">
          DOC. {index + 1}
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-line text-ink-main flex items-center justify-center bg-bone group-hover:bg-line transition-colors transition-colors shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div>
            <div className="font-mono-metadata text-xs text-ink-soft mb-1 tracking-wider uppercase flex items-center gap-1">
               <span className="material-symbols-outlined text-sm opacity-70">lock</span>
               CLASSIFIED ARCHIVE
            </div>
            <h4 className="font-headline-sm text-[15px] text-ink-soft leading-snug m-0 group-hover:text-ink-main transition-colors">
              {title}
            </h4>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-line-soft flex items-center justify-between text-ink-mute font-mono-metadata uppercase tracking-widest text-xs">
           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">touch_app</span> {en ? "Extract Dossier" : "點擊查閱附屬文檔"}</span>
           <span>Game Freak × Omega Force</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-paper border border-line-soft rounded-sm p-6 sm:p-8 max-w-[600px] w-full relative z-10 ambient-shadow"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-paper-warm text-ink-mute hover:text-ink hover:bg-line-soft transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              
              <div className="flex items-start gap-4 mb-6 border-b border-line-soft pb-6">
                <div className="w-12 h-12 shrink-0 rounded-full border-2 border-primary flex items-center justify-center bg-primary/5 text-primary">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="pr-6">
                  <div className="font-mono-metadata text-xs text-primary mb-1 tracking-wider uppercase">
                    CLASSIFIED ARCHIVE · {en ? "ACCESS GRANTED" : "權限解鎖"}
                  </div>
                  <h3 className="font-headline-sm text-[18px] text-ink leading-snug">{title}</h3>
                </div>
              </div>
              
              <div className="font-body-base text-[15px] text-ink-soft leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {content}
              </div>
              
              <div className="mt-8 pt-4 border-t border-line-soft flex justify-between items-center text-ink-mute">
                <span className="font-mono-metadata text-xs uppercase">META REPORT // {section.id.toUpperCase()}</span>
                <span className="font-mono-metadata text-xs uppercase">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuideNoteModal({ 
  isOpen, 
  onClose, 
  guideId, 
  secId, 
  en, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  guideId: string; 
  secId: string; 
  en: boolean; 
  title: string;
}) {
  const noteKey = `pokopia_notes_${guideId}_${secId}`;
  const [note, setNote] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(noteKey);
      if (saved) {
        setNote(saved);
      }
      setIsSaved(false);
    }
  }, [isOpen, noteKey]);

  const handleSave = () => {
    localStorage.setItem(noteKey, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-paper border-2 border-line-soft rounded-sm p-6 w-full max-w-[450px] relative z-10 ambient-shadow"
          >
            <div className="flex justify-between items-start mb-4 border-b border-line-soft pb-3">
              <div>
                <div className="font-mono-metadata text-xs text-ink-soft mb-1 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">edit_note</span>
                  {en ? "Personal Notes" : "個人筆記"}
                </div>
                <h3 className="font-headline-sm text-[16px] text-ink m-0 leading-tight">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-paper-warm text-ink-mute hover:text-ink hover:bg-line-soft transition-colors shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setIsSaved(false);
              }}
              placeholder={en ? "Write your tips and strategies here..." : "在此寫下你的遊玩心得或過關小技巧..."}
              className="w-full h-[150px] bg-paper-warm border border-line-soft p-3 rounded-sm font-body-base text-[14px] text-ink-soft resize-none focus:outline-none focus:border-primary/50 transition-colors custom-scrollbar"
            />
            
            <div className="mt-4 flex justify-between items-center">
              <span className={`font-mono-metadata text-xs uppercase transition-opacity ${isSaved ? "text-[#5c6238] opacity-100" : "opacity-0"}`}>
                <span className="flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">check_circle</span>
                   {en ? "Saved locally" : "已儲存至本機"}
                </span>
              </span>
              <button
                onClick={handleSave}
                className="bg-primary text-on-primary font-mono-metadata text-xs uppercase tracking-wider px-5 py-2 rounded-sm hover:-translate-y-0.5 active:translate-y-0 hover:brightness-110 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {en ? "Save Note" : "儲存筆記"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function GameShareInteractiveGuide({ en }: { en: boolean }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = en ? [
    {
      title: "Step 1: Host Lobby Setup",
      icon: "dns",
      desc: "An NS2 player launches 'Pokémon Pokopia' and opens the Multiplayer Lobby (Local Wireless or Online). Let the system initialize the communication port."
    },
    {
      title: "Step 2: Invite via GameChat",
      icon: "chat",
      desc: "Open the native NS2 system-level voice/chat app, GameChat. Select the 'GameShare' option and choose a friend from your list."
    },
    {
      title: "Step 3: Transfer Digital Token",
      icon: "toll",
      desc: "The system generates a virtual guest token. Your friend (playing on either NS2 or an original Switch console) receives an invitation notification. No game card needed."
    },
    {
      title: "Step 4: Stream Guest Client",
      icon: "downloading",
      desc: "Upon accepting, the friend's console streams a transient lightweight guest-client of Pokopia. They do not need to purchase or own the game software."
    },
    {
      title: "Step 5: Seamless Co-op Play",
      icon: "sports_esports",
      desc: "Up to 4 players can run together in your town. Each helper can summon 1 companion Pokémon, coordinate constructions, and voice-chat in real time."
    }
  ] : [
    {
      title: "步驟 1：主辦玩家建立大廳",
      icon: "dns",
      desc: "擁有一台 NS2 主機的主導玩家啟動《寶可夢 Pokopia》遊戲，並進入本地無線或線上多人大廳，確保網路連線暢通。"
    },
    {
      title: "步驟 2：開啟 GameChat 語音",
      icon: "chat",
      desc: "在主機選單中開啟系統層級的語音通訊工具「GameChat」，並進入內置的「連線分享 (GameShare)」功能選單。"
    },
    {
      title: "步驟 3：發送無卡連線邀請",
      icon: "toll",
      desc: "在 GameChat 好友名單中點擊發送邀請。同伴（不論是手持 NS2 還是初代 Switch 且「未擁有該遊戲軟體」（無卡遊玩））將會收到推播通知。"
    },
    {
      title: "步驟 4：串流下載訪客副本",
      icon: "downloading",
      desc: "好友接受邀請後，其主機將自動點對點進行沙盒引導，直接載入一個暫時性的 Pokopia 訪客遊玩副本，無需購買或插入任何遊戲卡帶！"
    },
    {
      title: "步驟 5：四人無縫同屏建造",
      icon: "sports_esports",
      desc: "成功加入！最多支援 4 位玩家連線，各可攜帶一隻寶可夢坐鎮。一邊即時用語音溝通，一邊無痛、無障礙地協作進行城鎮的大規模沙盒土木工程。"
    }
  ];

  return (
    <div className="bg-[#1a1c18] text-[#f4f4f4] border border-[#2e312c] rounded-md p-5 my-6 font-mono-metadata ambient-shadow relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#a53a2c] via-[#5c6238] to-[#795900]" />
      
      <div className="flex items-center justify-between pb-3 border-b border-[#2e312c] mb-4">
        <span className="text-xs uppercase text-[#a5cca4] flex items-center gap-1.5 font-bold">
          <span className="material-symbols-outlined text-[16px]">sync</span>
          GameShare & GameChat Express Guide (極速連線特刊)
        </span>
        <span className="text-xs uppercase bg-[#5c6238]/30 text-[#a5cca4] px-2 py-0.5 rounded-sm font-bold">NS2 PRO FEATURE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#212420] rounded-sm border border-[#2e312c] text-center min-h-[140px]">
          <span className="material-symbols-outlined text-[48px] text-[#a5cca4] mb-2">
            {steps[currentStep].icon}
          </span>
          <div className="text-xs text-ink-mute uppercase tracking-widest">{en ? "Step Progress" : "程序進度"}</div>
          <div className="text-sm font-bold text-[#a5cca4]">{currentStep + 1} / {steps.length}</div>
        </div>

        <div className="md:col-span-8 flex flex-col justify-between min-h-[140px] pl-2">
          <div>
            <h4 className="text-[#a5cca4] font-bold text-base mb-2">
              {steps[currentStep].title}
            </h4>
            <p className="text-xs leading-relaxed text-[#cfd2c8]">
              {steps[currentStep].desc}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-3 border-t border-[#2e312c]">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="text-[#a5cca4] text-xs uppercase flex items-center gap-1 disabled:opacity-30 cursor-pointer hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> {en ? "PREV" : "上一步"}
            </button>
            <div className="flex gap-1.5">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentStep ? "bg-[#a5cca4]" : "bg-[#2e312c]"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className="text-[#a5cca4] text-xs uppercase flex items-center gap-1 disabled:opacity-30 cursor-pointer hover:text-white transition-colors"
            >
              {en ? "NEXT" : "下一步"} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationToolsInteractiveShowcase({ en }: { en: boolean }) {
  const [activeTool, setActiveTool] = useState<"camera" | "magnet">("camera");

  return (
    <div className="bg-paper border hairline-border p-6 my-8">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-line-soft">
        <span className="material-symbols-outlined text-primary text-[22px]">settings_suggest</span>
        <h4 className="font-headline-sm text-[15px] hover:text-primary transition-colors text-ink-soft m-0">
          {en ? "Interactive Blueprint: Advanced Automations" : "智慧沙盒互動看板：神技與自動化流派"}
        </h4>
      </div>

      {/* Tool Selector Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setActiveTool("camera")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-sm border font-mono-metadata text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTool === "camera"
              ? "bg-primary text-on-primary border-primary shadow-sm"
              : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          {en ? "Security Cameras" : "遠端監視系統"}
        </button>
        <button
          onClick={() => setActiveTool("magnet")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-sm border font-mono-metadata text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTool === "magnet"
              ? "bg-primary text-on-primary border-primary shadow-sm"
              : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          {en ? "Magnet Rise" : "終期神技：電磁飄浮"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTool === "camera" ? (
          <motion.div
            key="camera-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 font-body-base"
          >
            <div className="bg-paper-warm p-4 border border-line-soft rounded-sm">
              <span className="font-mono-metadata text-xs text-primary uppercase block tracking-wider mb-1">
                SYSTEM MODULE DESCRIPTION // 營運效益分析
              </span>
              <p className="text-sm text-ink-main leading-relaxed m-0">
                {en 
                  ? "Deploying Security Cameras allows real-time monitoring of designated habitats. No more mindless patrolling! Once a target Pokémon enters the camera's perimeter, a system banner triggers via your Pokedex." 
                  : "當城鎮規模急劇擴張，反覆跑地圖尋找野生刷新個體極度耗費精力。建造並部署監視器後，即可進行棲息地的 24 小時離線遠端生成監看。目標寶可夢出現時將獲得通知提醒，徹底解放雙腿！"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="border border-line-soft p-3 rounded-sm bg-paper/60">
                <span className="font-mono-metadata text-xs text-ink-mute uppercase block tracking-wider">
                  🛒 {en ? "Build Recipes" : "結構組裝配方"}
                </span>
                <ul className="text-xs mt-1.5 space-y-1 text-ink-soft">
                  <li>• 10x {en ? "Copper Ingot" : "銅錠"} (Refined)</li>
                  <li>• 5x {en ? "Glass Plate" : "玻璃片"}</li>
                  <li>• 2x {en ? "Control Unit" : "控制單元"}</li>
                </ul>
              </div>
              <div className="border border-line-soft p-3 rounded-sm bg-paper/60">
                <span className="font-mono-metadata text-xs text-ink-mute uppercase block tracking-wider font-bold">
                  ⚠️ {en ? "Operation Tip" : "最佳操作指南"}
                </span>
                <p className="text-xs mt-1.5 text-ink-soft m-0 leading-relaxed">
                  {en 
                    ? "Place cameras targeting rare spawns (e.g. Clefairy under full moon). Pair with a speaker to automate luring!" 
                    : "建議直接對準難刷的傳說或稀有棲地（如圓月下的皮皮）。搭配喇叭和警報設施，一有風吹草動就能瞬間通知！"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="magnet-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 font-body-base"
          >
            <div className="bg-paper-warm p-4 border border-line-soft rounded-sm">
              <span className="font-mono-metadata text-xs text-primary uppercase block tracking-wider mb-1">
                LATE-GAME ULTIMATE TECH // 終局顛覆級沙盒神技
              </span>
              <p className="text-sm text-ink-main leading-relaxed m-0">
                {en 
                  ? "Acquired after game completion in the Spaceship Crater. Building the 'Factory Warehouse' (金屬桶, 凌亂電線, 控制單元, 路燈) unlocks Magnemite's 'Magnet Rise'. It allows players to hover, instantly destroy blocks (Press Y), and easily carry and shift gargantuan bedrock boulders or heavy structures without manual dragging." 
                  : "通關後在「太空船隕石坑」解鎖。在基地拼裝出「工廠倉庫群」（需要金屬桶、凌亂電線、控制單元與路燈）後，即可讓小磁怪獲得「電磁飄浮」磁力網。啟用此神技時，玩家可以在地圖上滯空飛行、一鍵粉碎土方（常規鍵位為 Y），甚至能輕鬆隔空搬運並乾坤大挪移那些平日無法搬移的巨石和沙盒巨型結構！"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamInitiationChecklistPanel({ en }: { en: boolean }) {
  const [activeStage, setActiveStage] = useState(0);
  const [itemChecked, setItemChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("challenge_checklist");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleItem = (stageIdx: number, itemId: string) => {
    setItemChecked(prev => {
      const key = `${stageIdx}_${itemId}`;
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("challenge_checklist", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const stages = [
    {
      num: "01",
      nameZh: "岩石徽章階段",
      nameEn: "Rock Badge Stage",
      items: [
        { id: "apple", nameZh: "蘋野果 x 5", nameEn: "Oran Berry x 5" }
      ],
      chainZh: "對著蘋野果樹使用頭錘 ➔ 採獲蘋野果",
      chainEn: "Use Headbutt on Oran Berry trees ➔ Gather Oran Berries",
      strategyZh: "初試身手！只要尋找基地或沿途的蘋野果樹，利用首隻寶可夢的「頭錘」技能撞擊樹幹，即可輕鬆震落蘋野果並進行收集。",
      strategyEn: "Simple beginning. Locate Oran Berry trees around your base, use your starting Pokemon's Headbutt and catch falling berries."
    },
    {
      num: "02",
      nameZh: "瀑布徽章階段",
      nameEn: "Cascade Badge Stage",
      items: [
        { id: "beans", nameZh: "豆子 x 10", nameEn: "Beans x 10" },
        { id: "tomatoes", nameZh: "番茄 x 10", nameEn: "Tomatoes x 10" },
        { id: "wheat", nameZh: "小麥 x 10", nameEn: "Wheat x 10" }
      ],
      chainZh: "海灘農田 ➔ 採摘豆子與番茄；解鎖山脊區域 ➔ 開墾小麥田 ➔ 採獲小麥",
      chainEn: "Beach Farm ➔ Harvest Beans & Tomatoes; Ridges Region ➔ Cultivate Wheat Field ➔ Crop Wheat",
      strategyZh: "考驗基礎農耕。豆子與番茄可在氣候溫潤的暗沉沉海邊直接採集或建立農田收成；小麥則需要玩家開拓至中部凸隆隆山地，並使用土木整地工具，建立人工麥田以獲得金黃小麥。",
      strategyEn: "Agriculture trial. Gather beachside wild crops or establish early garden patches. Wheat requires crossing to mountain terrain and planting seeds in tillable soil."
    },
    {
      num: "03",
      nameZh: "雷電徽章階段",
      nameEn: "Thunder Badge Stage",
      items: [
        { id: "lumber", nameZh: "木材 x 20 (居合斬精煉)", nameEn: "Lumber x 20 (Scyther Craft)" },
        { id: "wool", nameZh: "絨毛 x 5 (咩利羊採獲)", nameEn: "Wool x 5 (Mareep Harvest)" },
        { id: "paper", nameZh: "紙張 x 10 (廢紙提煉)", nameEn: "Paper x 10 (Paper Recycle)" }
      ],
      chainZh: "飛天螳螂「居合斬」加工作坊 ➔ 木材；設置草原「咩利羊」棲地 ➔ 收集絨毛；空島採集廢紙 ➔ 破破袋「回收」 ➔ 紙張",
      chainEn: "Scyther Workstation (Cut) ➔ Lumber; Meadow Mareep Habitat ➔ Gather Fleeces; Recycle Waste Paper ➔ Paper",
      strategyZh: "考驗寶可夢分工的起點。必須捕捉飛天螳螂，牠擁有的居合斬技能才能在工作坊將圓木精煉成木材；咩利羊需放置在專屬草原；紙張則是去空島收集垃圾紙片，利用破破袋的回收專長獲得。",
      strategyEn: "A start of workforce partition. Bring Scyther to logs workstation; pasture Mareep for wool; collect scrap paper from Skylands to recycle."
    },
    {
      num: "04",
      nameZh: "彩虹徽章階段",
      nameEn: "Rainbow Badge Stage",
      items: [
        { id: "bricks", nameZh: "磚塊 x 40 (火稚雞窯烤)", nameEn: "Bricks x 40 (Torchic Bake)" },
        { id: "gold", nameZh: "金錠 x 20 (金礦熔煉)", nameEn: "Gold Ingots x 20 (Gold Melt)" },
        { id: "concrete", nameZh: "混凝土 x 50 (攪拌機混製)", nameEn: "Concrete x 50 (Mixer)" }
      ],
      chainZh: "荒原泥流 + 降雨 ➔ 軟泥 ➔ 火稚雞高溫窯製 ➔ 磚塊；山脊地下金礦脈 ➔ 冶煉爐 ➔ 金錠；空島隆隆岩採石灰岩 ➔ 修建老匠 + 攪拌機 ➔ 混凝土",
      chainEn: "Wasteland Muddy Rain ➔ Clay ➔ Torchic Oven ➔ Bricks; Volcanic Gold Ore ➔ Forge Furnace ➔ Gold Ingots; Limestones ➔ Concrete Mixer ➔ Concrete",
      strategyZh: "沉重的工業測試！泥巴（必須在雨天於乾巴巴荒野挖掘泥漿）送入窯爐，交給火稚雞或小火龍烤成紅磚；金錠從山脊的火山腹地開採並熔煉；混凝土則是去空島用隆隆岩粉碎石灰岩，配合修建老匠在攪拌機中注入清水提煉。",
      strategyEn: "Heavy industry phase. Dig clay in rain to bake red bricks; smelt gold in mountain blast furnace; use Conkeldurr at concrete mixer on limestone chunks."
    },
    {
      num: "05",
      nameZh: "靈魂徽章階段",
      nameEn: "Soul Badge Stage",
      items: [
        { id: "elec", nameZh: "電力 x 50 (風水車串網)", nameEn: "Electricity x 50 (Connected Grid)" },
        { id: "shards", nameZh: "水晶碎片 x 10 (山脊開採)", nameEn: "Crystal Shards x 10" },
        { id: "gears", nameZh: "特殊齒輪 x 5 (巨鍛匠訂製)", nameEn: "Special Gears x 5" }
      ],
      chainZh: "海灘風車/水車發電 ➔ 連續「電線桿」輸電網 ➔ 電力 50點；遺跡深層採礦 ➔ 水晶碎片；混凝土/鐵錠 ➔ 送往空島巨鍛匠 ➔ 特殊齒輪",
      chainEn: "Windmill & Waterwheel ➔ Power Grid Poles ➔ 50x Electricity; Deep Ruins Mine ➔ Crystals; Concrete/Iron ➔ Tinkaton ➔ Special Gears",
      strategyZh: "本階段專注於電力網路與高階訂製之銜接。首先需要利用海灘的風車、水車，並親自砍伐原木架設多根「電線桿」將高壓電線拉回神秘塔中以達到 50 個電力；特殊齒輪則要把混凝土、鐵錠送到空島，請巨鍛匠幫忙敲打訂製。",
      strategyEn: "Pave Power Poles spanning beach generated electricity to the tower. Tap crystal veins in deep ruins. Offer high materials to Tinkaton for custom gears."
    },
    {
      num: "06",
      nameZh: "沼澤徽章階段",
      nameEn: "Marsh Badge Stage",
      items: [
        { id: "bed", nameZh: "工業床 x 4", nameEn: "Industrial Bed x 4" },
        { id: "lamp", nameZh: "渡假村燈 x 4", nameEn: "Resort Lamp x 4" },
        { id: "desk", nameZh: "辦公桌 x 4", nameEn: "Office Desk x 4" }
      ],
      chainZh: "在世界各地探索 ➔ 尋找精靈球 ➔ 收集「隱藏家具設計圖」 ➔ 準備金屬與羊毛 ➔ 高階工作台合成",
      chainEn: "In-world Exploration ➔ Hidden Blueprints inside Poke Balls ➔ Accumulate Metals/Wool ➔ Advanced Workbench Construction",
      strategyZh: "高階裝潢考核。你需要在四大地圖中，收集到散落於精靈球寶箱中的特殊家具設計圖。集齊設計圖後回到大本營，在高級木工桌消耗高階金屬與精製布料進行製作，將實物打包繳交！",
      strategyEn: "Furniture designs are scattered across all four main zones inside Poke Balls. Unlock recipes, craft them at high tier workbenches."
    },
    {
      num: "07",
      nameZh: "火山徽章階段",
      nameEn: "Volcano Badge Stage",
      items: [
        { id: "washer", nameZh: "洗衣機 x 1 (三區滿5級解鎖)", nameEn: "Washing Machine x 1" },
        { id: "fridge", nameZh: "冰箱 x 1 (三區滿5級解鎖)", nameEn: "Refrigerator x 1" },
        { id: "gameboy", nameZh: "Game Boy x 1 (空島5級餽贈)", nameEn: "Game Boy x 1" }
      ],
      chainZh: "前期三大區域修復 ➔ 綜合環境等級達 5 級 ➔ 系統解鎖洗衣機與冰箱設計圖；空島環境評分達滿分 5 級 ➔ 巨鍛匠贈送 Game Boy 設計圖",
      chainEn: "Three Starting Areas ➔ Max Level 5 ➔ Unlock Washer/Fridge Recipes; Max Sparkling Floating Island to 5 ➔ Secure Retro Game Boy Scheme",
      strategyZh: "極限科技樹的突破。這不再是單純收集設計圖，高科技生活家電需要玩家擁有強大的生態治理成就。你必須使前三個區域達到完美的環境評級 5，才能在電腦解鎖冰箱與洗衣機；而掌上型主機 Game Boy 則是閃閃浮島升至滿分的專屬謝禮！",
      strategyEn: "Technological pinnacle. Your overall ecological footprint must hit level 5 in three locations to unlock household designs. Game Boy schematics requires Skylands max rating."
    },
    {
      num: "08",
      nameZh: "最終通關挑戰",
      nameEn: "Final Stage",
      items: [
        { id: "photo", nameZh: "珍愛照片 x 1 (照相機快照)", nameEn: "Precious Photo x 1" },
        { id: "poppers", nameZh: "派對拉炮 x 2 (荒原滿級獎勵)", nameEn: "Party Poppers x 2" }
      ],
      chainZh: "在基地利用照相機給心愛的寶可夢快照 ➔ 取得原始照片檔案 ➔ 荒原生態最大成就 ➔ 滿級任務取得「拉炮」 ➔ 迎向溫馨通關動畫",
      chainEn: "Take Snapshots of friendly Pokemon ➔ Precious Photo; Max Withered Wasteland ➔ Grab Party Poppers ➔ Submit to Tower to trigger Final Credits",
      strategyZh: "溫暖人心的破關！派對拉炮是枯萎荒原最終五級任務的感恩回禮。而珍愛照片是利用照相機拍攝與召喚回大自然中夥伴的一張合照。將兩者塞入神秘塔修復最後的訊號系統，你將引爆拉炮，在淚目感動中迎向終局動畫，巨蔓藤博士的照片將會被送往太空船！",
      strategyEn: "The glorious ending. Capture snapshots of your companion to print photo. Get party blowers from desert grand task. Launch the balloon to let your nostalgic photo sail of the space."
    }
  ];

  // Calculated stats for active stage
  const currStage = stages[activeStage];
  const totalItems = currStage.items.length;
  const checkedItems = currStage.items.filter(it => !!itemChecked[`${activeStage}_${it.id}`]).length;

  // Overall checklist completion (count of all checked boxes across 8 stages)
  const totalCheckboxes = stages.reduce((acc, st) => acc + st.items.length, 0);
  const totalChecked = Object.values(itemChecked).filter(Boolean).length;
  const overallProgress = Math.round((totalChecked / totalCheckboxes) * 100);

  return (
    <div className="bg-paper border hairline-border p-6 sm:p-8 mb-8 select-none">
      {/* Header with Title and Global Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-line-soft mb-6">
        <div>
          <span className="font-mono text-xs text-primary uppercase tracking-widest block mb-1">
            MATERIAL TRACKER // 團隊入會物資追蹤器
          </span>
          <h3 className="font-headline-sm text-base text-ink-soft m-0 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">checklist_rtl</span>
            {en ? "8 Stages Interactive Material Checklist" : "互動式「8 階段物料解鎖清單表」"}
          </h3>
        </div>
        <div className="w-full sm:w-auto text-right">
          <div className="font-mono text-xs text-ink-mute mb-1 flex items-center sm:justify-end gap-1.5 matches-desktop">
            <span>{en ? "Overall Progress:" : "挑戰總進度:"}</span>
            <span className="text-ink-main font-bold">{totalChecked} / {totalCheckboxes}</span>
          </div>
          <div className="w-full sm:w-36 bg-paper border border-line-soft h-2 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Horizontal Tab Selector */}
      <div className="flex overflow-x-auto gap-1.5 pb-2.5 mb-5 shrink-0 scroll-smooth custom-scrollbar">
        {stages.map((st, idx) => {
          const isSelected = activeStage === idx;
          const isDone = st.items.every(it => !!itemChecked[`${idx}_${it.id}`]);
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-on-primary border-primary shadow-sm font-bold"
                  : isDone
                  ? "bg-[#5c6238]/10 text-[#5c6238] border-[#5c6238]/30 hover:bg-[#5c6238]/20"
                  : "bg-paper-warm text-ink-mute border-line-soft hover:text-primary hover:border-primary"
              }`}
            >
              <span>{st.num}</span>
              <span className="max-w-[70px] sm:max-w-none truncate">{en ? st.nameEn : st.nameZh}</span>
              {isDone && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
            </button>
          );
        })}
      </div>

      {/* Grid: Left side checklist & strategy, Right side Refinement Chain flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="bg-paper-warm p-4 border border-line-soft rounded-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs text-primary font-bold">
                STAGE {currStage.num}: {en ? currStage.nameEn : currStage.nameZh}
              </span>
              <span className="font-mono text-xs text-ink-mute">
                {en ? "Checked" : "已募集"}: {checkedItems}/{totalItems}
              </span>
            </div>

            {/* Checklist Checkboxes */}
            <div className="space-y-2 mb-4">
              {currStage.items.map((it) => {
                const checked = !!itemChecked[`${activeStage}_${it.id}`];
                return (
                  <label 
                    key={it.id} 
                    className={`flex items-center gap-3 p-3 rounded-sm border transition-all cursor-pointer select-none ${
                      checked 
                        ? "bg-[#5c6238]/5 border-[#5c6238]/30 text-ink-mute/70"
                        : "bg-paper border-line-soft hover:border-primary/40 text-ink-soft"
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(activeStage, it.id)}
                      className="accent-primary w-4 h-4 cursor-pointer shrink-0"
                    />
                    <span className={`font-mono text-xs ${checked ? "line-through text-ink-mute/60" : "font-bold text-ink-soft"}`}>
                      {en ? it.nameEn : it.nameZh}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-line-soft">
              <span className="font-mono text-xs text-ink-mute uppercase block tracking-wider mb-1">
                {en ? "Unlock Strategy" : "核心拓荒與獲取攻略 / STRATEGY"}
              </span>
              <p className="text-xs text-ink-soft leading-relaxed m-0">
                {en ? currStage.strategyEn : currStage.strategyZh}
              </p>
            </div>
          </div>
        </div>

        {/* Refinement Workflow Box (獲取精煉鏈) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-[#1f201c] text-[#f1f2ec] border border-[#2e302b] p-4 rounded-sm h-full flex flex-col justify-between">
            <div>
              <div className="pb-2 border-b border-[#2e302b] mb-3">
                <span className="font-mono text-xs text-[#a5cca4] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[14px]">hub</span>
                  {en ? "Refinement Industrial Chain" : "核心工業精煉鏈 / Craft Flow"}
                </span>
              </div>

              <div className="my-2 space-y-3 font-mono text-xs text-[#cfd2c8]">
                {en ? (
                  <div className="flex flex-col gap-2">
                    <p className="m-0 leading-relaxed text-xs">
                      {currStage.chainEn}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="bg-[#2a2c26] border border-[#3e413a] p-2 rounded-sm text-center font-bold text-[#a5cca4]">
                      ⚙️ 生態精煉工藝流向
                    </div>
                    <p className="m-0 leading-relaxed text-xs p-1.5 pl-2.5 border-l-2 border-[#5c6853]">
                      {currStage.chainZh}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-[#2e302b] text-center text-xs text-ink-mute">
              {en ? "Game Freak × Omega Force Mechanics" : "由巨蔓藤博士研究所專業提供"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Guide() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNoteSection, setActiveNoteSection] = useState<{id: string, titleEn: string, titleZh: string} | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("pokopia_completed_steps");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleStep = (guideId: string, secId: string, stepIdx: number) => {
    const key = `${guideId}_${secId}_${stepIdx}`;
    setCompletedSteps((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("pokopia_completed_steps", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    fetch("/data/guide.json")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        const params = new URLSearchParams(location.search);
        const idParam = params.get("id");
        if (idParam && d.guides?.find((g: any) => g.id === idParam)) {
          setActiveId(idParam);
        } else {
          setActiveId(d.guides?.[0]?.id ?? null);
        }
      });
  }, [location.search]);

  const en = i18n.language === "en";
  const fallbackTitle = en ? "Guides & Walkthroughs | Pokopia Chronicles" : "戰術指南與攻略檔案 | Pokopia 年代記";
  const fallbackDescription = en
    ? "Read Pokopia walkthroughs for regional restoration, resource refining, legendary routes, and endgame habitat planning."
    : "閱讀 Pokopia 的區域復育、資源精煉、傳說路線與終局棲地規劃指南。";

  if (!data || !activeId) {
    return (
      <Seo
        title={fallbackTitle}
        description={fallbackDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia guide", "Pokopia walkthrough", "legendary encounters", "resource refining"]}
      />
    );
  }

  const guides: any[] = data.guides ?? [];
  const guide = guides.find((g) => g.id === activeId) ?? guides[0];
  const seoTitle = `${en ? guide.titleEn : guide.titleZh} | ${en ? "Pokopia Chronicles" : "Pokopia 年代記"}`;
  const seoDescription = en ? guide.subtitleEn : guide.subtitleZh;

  const openGuide = (id: string) => {
    setActiveId(id);
    navigate(`/guide?id=${id}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const related = (guide.relatedIds ?? [])
    .map((id: string) => guides.find((g) => g.id === id))
    .filter(Boolean);

  // Count total and completed steps for the active guide
  const totalSteps = guide.sections.reduce((acc: number, sec: any) => acc + (sec.steps?.length ?? 0), 0);
  const completedStepsInGuide = guide.sections.reduce((acc: number, sec: any) => {
    if (!sec.steps) return acc;
    return acc + sec.steps.filter((_: any, idx: number) => {
      const key = `${guide.id}_${sec.id}_${idx}`;
      return !!completedSteps[key];
    }).length;
  }, 0);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        lang={en ? "en" : "zh-Hant"}
        keywords={["Pokemon Pokopia guide", "Pokopia walkthrough", guide.titleEn, guide.categoryEn]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: en ? guide.titleEn : guide.titleZh,
          description: seoDescription,
          inLanguage: en ? "en" : "zh-Hant",
          url: `https://pokemoninfoperfer.vercel.app/guide?id=${guide.id}`,
          author: {
            "@type": "Organization",
            name: "Pokopia Chronicles",
          },
          about: en ? guide.categoryEn : guide.categoryZh,
        }}
      />
      {/* Volume switcher — the real archive index (Hidden on Mobile, handled via Classical Floating Academic Directory) */}
      <nav className="hidden md:flex flex-wrap gap-xs mb-lg">
        {guides.map((g) => (
          <button
            key={g.id}
            onClick={() => openGuide(g.id)}
            className={`font-mono-metadata text-mono-metadata uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              g.id === activeId
                ? "bg-primary text-on-primary border-primary"
                : "text-ink-mute border-line-soft hover:text-primary hover:border-primary"
            }`}
          >
            Vol {g.vol} · {en ? g.categoryEn : g.categoryZh}
          </button>
        ))}
      </nav>

      <div className="border-b border-line pb-lg mb-lg flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="font-mono-metadata text-mono-metadata text-ink-mute uppercase mb-4 tracking-widest">
            Volume {guide.vol}. / {en ? guide.categoryEn : guide.categoryZh}
          </div>
          <h1 className="font-display-lg text-display-lg text-ink-soft mb-sm leading-tight max-w-4xl">
            {en ? guide.titleEn : guide.titleZh}
          </h1>
          <p className="font-body-italic text-body-italic text-ink-mute max-w-2xl">
            {en ? guide.subtitleEn : guide.subtitleZh}
          </p>

          {totalSteps > 0 && (
            <div className="mt-6 p-4 bg-paper border hairline-border select-none">
              <div className="flex justify-between items-center mb-1.5 font-mono-metadata text-xs">
                <span className="text-ink-mute flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                  {en ? "TASK COMPLETION RATE" : "任務復育達成度"}
                </span>
                <span className="text-primary font-bold">
                  {completedStepsInGuide} / {totalSteps} ({Math.round((completedStepsInGuide / totalSteps) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-paper border border-line-soft h-3 rounded-full overflow-hidden p-0.5">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedStepsInGuide / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Zen Mode Toggle */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className={`shrink-0 flex items-center justify-center gap-2 border hairline-border px-4 py-3 font-mono-metadata text-xs uppercase tracking-widest transition-colors ${
            isZenMode ? "bg-bone text-ink-main border-ink-main" : "bg-paper text-ink-mute hover:text-ink-main hover:bg-bone"
          }`}
          title={en ? "Toggle Zen Reading Mode" : "切換沉浸閱讀模式"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isZenMode ? "fullscreen_exit" : "fullscreen"}
          </span>
          {isZenMode ? (en ? "Exit Zen Mode" : "退出沉浸模式") : (en ? "Zen Reading Mode" : "沉浸閱讀模式")}
        </button>
      </div>

      <GuideDataChart en={en} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
        {/* Table of Contents - Quick Links Floating Sidebar */}
        {!isZenMode && (
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-[120px] bg-paper border hairline-border p-6 shadow-sm">
              <div className="font-mono-metadata text-xs text-ink-soft mb-6 uppercase tracking-widest border-b hairline-bottom pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">bookmark</span>
                {en ? "Quick Links" : "快速連結導航"}
              </div>
              <ul className="space-y-4">
                {guide.sections.map((sec: any) => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`} className="font-mono-metadata text-xs text-ink-mute hover:text-ink-main transition-colors flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">{sec.roman}</span> 
                      <span className="leading-snug">{en ? sec.titleEn : sec.titleZh}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Content */}
        <article className={`${isZenMode ? "md:col-span-12" : "lg:col-span-9"} font-body-base text-body-base text-ink-soft leading-relaxed transition-all duration-500`}>
          {guide.id === "team-initiation-challenge" && (
            <TeamInitiationChecklistPanel en={en} />
          )}
          {guide.sections.map((sec: any, index: number) => (
            <ScrollFade key={sec.id} depth="none" className="mb-12">
              {index === 2 && guide.stats && (
                 <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">{t("guide.optimalTime")}</div>
                    <div className="font-headline-md text-headline-md text-ink-soft">{en ? guide.stats.optimalTimeEn : guide.stats.optimalTimeZh}</div>
                  </div>
                  <div className="bg-paper-warm hairline-border p-4 rounded-sm">
                    <div className="font-label-caps text-label-caps text-ink-mute mb-2">{t("guide.successRate")}</div>
                    <div className="font-headline-md text-headline-md text-primary">{guide.stats.successRate}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-12 mb-6">
                <h2 id={sec.id} className="font-headline-sm text-headline-sm text-ink-soft flex flex-wrap items-center gap-4 scroll-mt-28 m-0">
                  <span className="text-primary font-mono-metadata text-sm">{sec.roman}</span> {en ? sec.titleEn : sec.titleZh}
                </h2>
                <button
                  onClick={() => setActiveNoteSection({ id: sec.id, titleEn: sec.titleEn, titleZh: sec.titleZh })}
                  className="shrink-0 flex items-center justify-center gap-1.5 w-8 h-8 md:w-auto md:px-3 md:py-1.5 rounded-full md:rounded-sm bg-bone border border-line-soft text-ink-mute hover:text-primary hover:border-primary/50 transition-colors cursor-pointer group"
                  title={en ? "Add Personal Note" : "新增個人筆記"}
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:scale-105 transition-transform">edit_note</span>
                  <span className="font-mono-metadata text-xs uppercase tracking-widest hidden md:inline-block">
                    {en ? "Notes" : "筆記"}
                  </span>
                </button>
              </div>
              {sec.link && (
                <div className="mb-6 -mt-2">
                  <a href={sec.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono-metadata text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/20">
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    {en ? "External Resource" : "前往外部網站"}
                  </a>
                </div>
              )}
              {guide.id === "meta-history" ? (
                <DocumentArchiveCard section={sec} en={en} index={index} />
              ) : (
                <p className="mb-6">{en ? sec.contentEn : sec.contentZh}</p>
              )}

              {sec.listEn && (
                <ul className="list-disc pl-6 space-y-4 mb-8">
                  {(en ? sec.listEn : sec.listZh).map((item: string, i: number) => {
                     const m = item.match(/^(.*?)(：|:\s)(.*)$/);
                     return m ? (
                        <li key={i}><strong>{m[1]}{m[2].trim()}</strong> {m[3]}</li>
                     ) : (
                        <li key={i}>{item}</li>
                     );
                  })}
                </ul>
              )}

              {sec.steps && (
                <div className="my-8 relative pl-6 border-l-2 border-primary/20 space-y-8">
                  {sec.steps.map((step: any, sIdx: number) => {
                    const isStepDone = !!completedSteps[`${guide.id}_${sec.id}_${sIdx}`];
                    return (
                      <div key={step.id || sIdx} className="relative group">
                        {/* Timeline circular node marker acting as interactive button */}
                        <button 
                          onClick={() => toggleStep(guide.id, sec.id, sIdx)}
                          className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shadow-sm cursor-pointer z-10 ${
                            isStepDone 
                              ? "bg-primary border-primary text-paper hover:opacity-90" 
                              : "bg-paper border-primary text-primary hover:bg-primary hover:text-paper"
                          }`}
                          title={isStepDone ? (en ? "Mark Incomplete" : "標記為未完成") : (en ? "Mark Completed" : "標記為完成")}
                        >
                          <span className="material-symbols-outlined text-base font-bold">
                            {isStepDone ? "check" : (step.icon || "done")}
                          </span>
                        </button>
                        
                        {/* Detailed node card */}
                        <div className={`border p-5 rounded-sm ambient-shadow transition-all ${
                          isStepDone 
                            ? "bg-primary/[0.02] border-primary/40 opacity-80 hover:opacity-100" 
                            : "bg-bone border-line-soft hover:translate-x-1 hover:border-primary/50"
                        }`}>
                          <div className="flex flex-wrap justify-between items-center gap-2 mb-3 border-b border-line-soft pb-2">
                            <h4 className="font-headline-sm text-[15px] font-medium text-ink-soft flex items-center gap-2 m-0 p-0">
                              <button
                                onClick={() => toggleStep(guide.id, sec.id, sIdx)}
                                className="focus:outline-none flex items-center justify-center shrink-0 text-primary hover:scale-105 transition-transform cursor-pointer"
                                aria-label={isStepDone ? (en ? "Mark Incomplete" : "標記為未完成") : (en ? "Mark Completed" : "標記為完成")}
                              >
                                <span className="material-symbols-outlined text-[20px] select-none">
                                  {isStepDone ? "check_box" : "check_box_outline_blank"}
                                </span>
                              </button>
                              <span className="font-mono-metadata text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-sm font-bold tracking-wider">
                                STEP {sIdx + 1}
                              </span>
                              <span className={isStepDone ? "line-through text-ink-mute/70" : ""}>
                                {en ? step.nodeTitleEn : step.nodeTitleZh}
                              </span>
                            </h4>
                            {step.badgeZh && (
                              <span className="font-mono-metadata text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-primary/15 text-primary border border-primary/30">
                                {en ? (step.badgeEn || step.badgeZh) : step.badgeZh}
                              </span>
                            )}
                          </div>
                          <p className={`font-body-base text-sm leading-relaxed m-0 whitespace-pre-line ${
                            isStepDone ? "text-ink-mute/70" : "text-ink-main"
                          }`}>
                            {en ? step.descEn : step.descZh}
                          </p>
                          {step.link && (
                            <div className="mt-4 pt-3 border-t border-line-soft">
                              <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono-metadata text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-sm border border-primary/20">
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                {en ? "External Resource" : "前往外部網站"}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {sec.id === "automation-tools" && (
                <AutomationToolsInteractiveShowcase en={en} />
              )}

              {sec.id === "multiplayer-customization" && (
                <GameShareInteractiveGuide en={en} />
              )}

              <GuideDiagram section={sec} index={index} en={en} />
              {sec.image && (
                <p className="font-mono-metadata text-mono-metadata text-ink-mute text-center max-w-[520px] mx-auto -mt-4 mb-8 leading-relaxed">
                  {en ? sec.image.captionEn : sec.image.captionZh}
                </p>
              )}

              <div className="mt-8 border-t border-dashed border-line-soft pt-sm mb-12">
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint flex items-center justify-start gap-2 flex-wrap mb-1">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">link</span>{en ? "Source:" : "資料出處:"}</span>
                    <a href="https://bulbapedia.bulbagarden.net/wiki/Main_Page" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                       Bulbapedia
                    </a>
                    <span>·</span>
                    <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                       PokeAPI
                    </a>
                 </p>
                 <p className="font-mono-metadata text-mono-metadata text-ink-faint text-xs leading-tight flex items-start gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm mt-[1px]">copyright</span>
                    <span>{en ? "Nintendo, Game Freak, and The Pokémon Company." : "版權歸屬任天堂、Game Freak 及 The Pokémon Company。本站僅作攻略資訊整合。"}</span>
                 </p>
              </div>
            </ScrollFade>
          ))}
        </article>
      </div>

      {/* Further Reading */}
      {related.length > 0 && (
        <div className="mt-xl pt-lg border-t border-line">
          <div className="flex justify-between items-end mb-8">
            <h3 className="font-headline-sm text-headline-sm text-ink-soft">{t("guide.furtherReading")}</h3>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-label-caps text-label-caps text-primary hover:opacity-80 transition-opacity flex items-center gap-1 uppercase"
            >
              {t("guide.viewArchive")} <span className="material-symbols-outlined text-sm">arrow_upward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {related.map((item: any) => (
              <button
                key={item.id}
                onClick={() => openGuide(item.id)}
                className="group border hairline-border bg-paper p-6 flex flex-col h-full text-left hover:bg-bone transition-colors"
              >
                <div className="flex justify-between items-start mb-6 border-b border-line-soft pb-2">
                  <span className="font-mono-metadata text-mono-metadata text-primary">Vol. {item.vol}</span>
                  <span className="font-mono-metadata text-mono-metadata text-ink-mute">{en ? item.categoryEn : item.categoryZh}</span>
                </div>
                <h4 className="font-body-italic text-body-italic text-ink-soft group-hover:text-primary transition-colors flex-grow">
                  {en ? item.titleEn : item.titleZh}
                </h4>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Guide sources citation from info4.md, info1.md, info3.md */}
      <div className="mt-xl pt-lg border-t border-line">
        <h3 className="font-headline-sm text-headline-sm text-ink-soft mb-sm">
          {en ? "References & Source Citations" : "資料來源與引用"}
        </h3>
        <p className="font-body-base text-body-base text-ink-mute mb-md">
          {en 
            ? "The strategies, structural blueprints, and habitat data compiled in these guides are sourced from the following comprehensive databases and community wikis:"
            : "本攻略所彙編之戰術指南、建構藍圖與棲息地細節等資料，皆參考自以下強大的資料庫與社群站點："}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <a href="https://pokopia.gamertw.com/zh-TW/guide/beginner" target="_blank" rel="noreferrer" className="block bg-paper border hairline-border p-6 hover:bg-bone transition-colors group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GamerTW</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokemon Pokopia 新手指南</p>
          </a>
          
          <a href="https://tw.pogoskill.com/game-app/pokemon-pokopia-game-strategy.html" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">PoGoskill</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokemon Pokopia 攻略（新手玩法與主線流程）</p>
          </a>
          
          <a href="https://forum.gamer.com.tw/C.php?bsn=1647&snA=128424" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">巴哈姆特哈啦板</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">【討論】一人一個 Pokopia 小知識！</p>
          </a>
          
          <a href="https://gamewith.jp/pocoapokemon/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GameWith</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">ぽこあポケモン攻略｜ぽこポケ</p>
          </a>
          
          <a href="https://pokopia.center/posts/pokopia-evolution-guide-2026/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Pokopia.center</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Habitat & Milestone Database</p>
          </a>
          
          <a href="https://www.nintendolife.com/guides/pokemon-pokopia-sparkling-skylands-rebuild-the-huge-building-guide-how-to-help-tinkmaster" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Nintendo Life</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Complete Pokédex & Habitat Dex</p>
          </a>
          
          <a href="https://www.eurogamer.net/pokemon-pokopia-walkthrough" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Eurogamer</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Pokémon Pokopia Pokédex & Walkthrough</p>
          </a>
          
          <a href="https://games.gg/pokemon-pokopia/guides/pokemon-pokopia-how-to-get-eevee-and-all-eeveelutions/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Games.gg</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">How to Get Eevee and All Eeveelutions</p>
          </a>

          <a href="https://gametyrant.com/news/pokmon-pokopia-team-initiation-challenge-guide" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">GameTyrant</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Team Initiation Challenge Guide</p>
          </a>

          <a href="https://www.reddit.com/r/Pokopia/comments/1rqh19y/grid_size_of_altar_of_the_flame/" target="_blank" rel="noreferrer" className="block bg-bone border border-line-soft p-sm rounded-sm ambient-shadow paper-texture hover:-translate-y-1 transition-transform group">
            <h4 className="font-label-caps text-label-caps text-ink-soft group-hover:text-primary transition-colors mb-1">Reddit r/Pokopia</h4>
            <p className="font-mono-metadata text-mono-metadata text-ink-mute">Grid Size of Altar of the Flame & Community Encyclopedia</p>
          </a>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="scroll-to-top-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-on-primary rounded-full shadow-lg hover:brightness-110 active:scale-95 focus:outline-none transition-all flex items-center justify-center cursor-pointer border border-primary/20 aspect-square group"
            title={en ? "Scroll to Top" : "回到頂部"}
            aria-label={en ? "Scroll to top" : "回到頂部"}
          >
            <span className="material-symbols-outlined text-[24px] font-bold group-hover:-translate-y-0.5 transition-transform">
              arrow_upward
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Floating Academic Directory (Classical Newspaper Style, Proposal 2) */}
      <div className="md:hidden">
        {/* Backdrop overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-ink/30 backdrop-blur-xs z-[80]"
            />
          )}
        </AnimatePresence>

        {/* Floating Active Handle (The Trigger) */}
        <div 
          className="fixed right-4 top-[55%] -translate-y-1/2 z-[90] flex flex-col items-end gap-2 pointer-events-auto"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-14 h-14 rounded-full bg-bone border border-[#D2C5A9] text-ink-soft cursor-pointer select-none flex flex-col items-center justify-center shadow-md border-t-2 border-t-primary relative"
            aria-label="Navigation Menu"
            id="floating-archive-trigger"
          >
            {/* Spinning/pulsating active seal motif */}
            <span className="material-symbols-outlined text-[22px] text-primary">
              menu_book
            </span>
            <span className="font-mono-metadata text-[8px] uppercase tracking-wider text-ink-mute -mt-0.5 font-semibold">
              Vol.{guide.vol}
            </span>
            
            {/* Tiny closed book symbol bookmark strip or aesthetic seal detail hanging from bottom */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-4 bg-primary rounded-b-xs opacity-90 shadow-xs" />
          </motion.button>
        </div>

        {/* Directory Content Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.93, x: "-50%", y: "-47%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.93, x: "-50%", y: "-47%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed left-1/2 top-1/2 z-[85] w-[88vw] max-w-[310px] pointer-events-auto"
              id="floating-archive-panel"
            >
              {/* Outer paper border container */}
              <div className="bg-[#FAF6EC] border-2 border-[#D2C5A9] rounded-sm p-4 relative shadow-[0_12px_40px_-8px_rgba(21,20,15,0.3)] paper-texture">
                {/* 4 Corner classical star decorations */}
                <span className="absolute top-1 left-1 font-mono text-xs text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute top-1 right-1 font-mono text-xs text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute bottom-1 left-1 font-mono text-xs text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>
                <span className="absolute bottom-1 right-1 font-mono text-xs text-[#A53A2C]/45 leading-none pointer-events-none select-none">✦</span>

                {/* Header title */}
                <div className="border-b-2 border-double border-[#D2C5A9] pb-2 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">auto_stories</span>
                    <span className="font-body-italic text-base font-bold tracking-wide text-ink-soft italic uppercase">
                      {en ? "Classified Archives" : "機密學術年鑑"}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-paper-warm text-ink-mute hover:text-ink active:scale-95 transition-transform"
                    aria-label="Close"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>

                {/* Sub-panels inside scroll container */}
                <div className="max-h-[50vh] overflow-y-auto pr-1 flex flex-col gap-4 custom-scrollbar select-none">
                  
                  {/* Category 1: Chronological Volume Selection */}
                  <div>
                    <h4 className="font-mono-metadata text-xs text-primary/70 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                      <span>■</span>
                      <span>{en ? "Volume Index" : "編年卷軸目錄"}</span>
                    </h4>
                    <div className="flex flex-col gap-1 max-h-[22vh] overflow-y-auto pr-0.5 custom-scrollbar">
                      {guides.map((g) => {
                        const isCurrent = g.id === activeId;
                        return (
                          <button
                            key={g.id}
                            onClick={() => {
                              openGuide(g.id);
                              setIsMenuOpen(false);
                            }}
                            className={`text-left w-full font-mono-metadata text-xs px-2 py-1.5 rounded-sm flex items-start gap-1 transition-colors cursor-pointer ${
                              isCurrent
                                ? "bg-primary text-on-primary font-bold shadow-xs border border-primary"
                                : "text-ink-soft hover:bg-primary/5 active:bg-primary/10 border border-transparent"
                            }`}
                          >
                            <span className="font-bold shrink-0">Vol.{g.vol}</span>
                            <span className="truncate border-l border-current/25 pl-1.5 ml-1">
                              {en ? g.categoryEn : g.categoryZh}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Aesthetic Separation Line */}
                  <div className="border-t border-dashed border-[#D2C5A9] my-1" />

                  {/* Category 2: Section Table of Contents of active volume */}
                  <div>
                    <h4 className="font-mono-metadata text-xs text-primary/70 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                      <span>■</span>
                      <span>{en ? "Dossier Contents" : "本卷專題精選"}</span>
                    </h4>
                    
                    <div className="flex flex-col gap-1 max-h-[24vh] overflow-y-auto pr-0.5 custom-scrollbar">
                      {guide.sections.map((sec: any) => (
                        <a
                          key={sec.id}
                          href={`#${sec.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="font-body-base text-xs text-ink-mute hover:text-ink-main active:text-ink-main hover:bg-bone transition-colors duration-200 py-1 px-1.5 rounded-sm leading-snug flex items-start gap-1 cursor-pointer border-b border-line-soft/40 last:border-0"
                        >
                          <span className="text-primary font-mono-metadata text-xs scale-90 translate-y-[1px] font-bold shrink-0">{sec.roman}</span>
                          <span className="truncate">{en ? sec.titleEn : sec.titleZh}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                </div>

                {/* Footer seal detail */}
                <div className="mt-3 pt-2 border-t border-dashed border-[#D2C5A9] flex items-center justify-between text-[8px] font-mono-metadata text-ink-faint uppercase font-semibold">
                  <span>ID: {guide.id.toUpperCase()}</span>
                  <span>© COMPASS v1.2</span>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <GuideNoteModal 
        isOpen={activeNoteSection !== null}
        onClose={() => setActiveNoteSection(null)}
        guideId={guide.id}
        secId={activeNoteSection?.id || ""}
        en={en}
        title={en && activeNoteSection ? activeNoteSection.titleEn : activeNoteSection?.titleZh || ""}
      />
    </>
  );
}
