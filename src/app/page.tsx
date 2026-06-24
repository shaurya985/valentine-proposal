"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Volume2, VolumeX } from "lucide-react";

// List of pleading texts for the "No" button when clicked
const NO_BUTTON_TEXTS = [
  "No",
  "Are you sure? 🥺",
  "Really sure? 💔",
  "Think about it again! 😭",
  "Please say yes... 🙏",
  "I will be very sad... 😢",
  "Don't do this to me! 💔",
  "You're breaking my heart! 😿",
  "Ok, what if I buy you chocolates? 🍫",
  "What if we go for a date? 🌹",
  "Still no? Please? 🥺",
  "Just click YES already! 😂",
  "Nice try, click Yes! 😉"
];

// Helper to generate falling hearts particles
interface HeartParticle {
  id: number;
  left: number; // percentage screen width
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  colorClass: string;
}

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Generate heart particles for the celebration screen
  useEffect(() => {
    if (accepted) {
      const colors = [
        "text-rose-400",
        "text-pink-400",
        "text-rose-500",
        "text-pink-500",
        "text-red-400"
      ];
      const newHearts = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // 0 to 100% of screen width
        size: Math.random() * 24 + 12, // 12px to 36px
        duration: Math.random() * 4 + 3, // 3s to 7s fall speed
        delay: Math.random() * 5, // up to 5s delay
        colorClass: colors[Math.floor(Math.random() * colors.length)]
      }));
      setHearts(newHearts);

      // Play soft celebration click sound if enabled
      if (soundEnabled) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          // Cute chime sound
          const playNote = (freq: number, start: number, dur: number) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.start(start);
            osc.stop(start + dur);
          };
          playNote(523.25, audioCtx.currentTime, 0.3); // C5
          playNote(659.25, audioCtx.currentTime + 0.1, 0.3); // E5
          playNote(783.99, audioCtx.currentTime + 0.2, 0.4); // G5
          playNote(1046.50, audioCtx.currentTime + 0.3, 0.6); // C6
        } catch (e) {
          console.warn("Chime play blocked or unsupported:", e);
        }
      }
    }
  }, [accepted, soundEnabled]);

  // Handle "No" button click
  const handleNoClick = () => {
    setNoClicks((prev) => prev + 1);
    
    // Play a tiny sad blip sound if enabled
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 220; // A3 (low note)
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch (e) {
        console.warn("Blip play blocked or unsupported:", e);
      }
    }
  };

  // Yes button dynamically scales up
  // Scales up by 35% with each "No" click, capped at a very large multiplier (e.g. 5x)
  const yesScale = Math.min(1 + noClicks * 0.35, 5);
  // No button shrinks slightly (scaled down to min 0.35)
  const noScale = Math.max(1 - noClicks * 0.08, 0.35);

  // Get current text for "No" button
  const currentNoText = NO_BUTTON_TEXTS[Math.min(noClicks, NO_BUTTON_TEXTS.length - 1)];

  return (
    <main className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-radial from-[#ffeef0] via-[#fff5f6] to-[#ffdce0]">
      
      {/* Sound toggle button */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-pink-100 shadow-sm text-pink-500 hover:text-pink-600 transition-colors"
        title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        id="sound-toggle-btn"
      >
        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Decorative background sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/10 animate-bounce duration-5000">✨</div>
        <div className="absolute top-1/3 right-1/8 animate-pulse text-pink-300 text-xl">💖</div>
        <div className="absolute bottom-1/4 left-1/6 animate-pulse text-rose-300 text-lg">❤️</div>
        <div className="absolute bottom-1/3 right-1/10 animate-bounce duration-3000 text-rose-200">✨</div>
      </div>

      <AnimatePresence mode="wait">
        {!accepted ? (
          /* PROPOSAL PHASE */
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full max-w-lg z-10 flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_20px_50px_rgba(244,63,94,0.1)]"
            id="proposal-card"
          >
            {/* Hero Image Container */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 rounded-2xl overflow-hidden bg-rose-50 border-4 border-white shadow-md flex items-center justify-center">
              {/* 
                REMINDER: Replace proposal-animation.gif with a cute proposal animation/GIF 
              */}
              <img
                src="proposal-animation.gif"
                alt="Proposal Animation"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback beautiful illustration/icon if proposal-animation.gif doesn't exist yet
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("proposal-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                id="proposal-fallback"
                className="hidden absolute inset-0 flex flex-col items-center justify-center text-rose-400 bg-gradient-to-tr from-rose-50 to-pink-100 p-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <Heart className="w-20 h-20 fill-current text-rose-400" />
                </motion.div>
                <span className="text-xs font-semibold text-rose-600 mt-3 tracking-wider uppercase">Loading Love...</span>
              </div>
            </div>

            {/* Proposal Heading */}
            <h1 className="font-pacifico text-3xl sm:text-4xl md:text-5xl text-rose-800 leading-tight mb-8 drop-shadow-sm select-none">
              Will you be my Valentine? 💖
            </h1>

            {/* Interactive Response Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[140px] w-full px-2">
              <motion.button
                onClick={() => setAccepted(true)}
                style={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-lg rounded-full shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_10px_25px_rgba(244,63,94,0.45)] transform active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer"
                id="yes-btn"
              >
                <Heart className="w-5 h-5 fill-current text-white animate-pulse" />
                <span>Yes</span>
              </motion.button>

              {noClicks < NO_BUTTON_TEXTS.length ? (
                <motion.button
                  onClick={handleNoClick}
                  style={{ scale: noScale }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-base rounded-full border border-slate-300/30 hover:border-slate-300/60 shadow-sm active:scale-95 transition-all duration-300 select-none cursor-pointer"
                  id="no-btn"
                >
                  {currentNoText}
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        ) : (
          /* CELEBRATION PHASE */
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xl z-10 flex flex-col items-center text-center p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_25px_60px_rgba(244,63,94,0.15)]"
            id="celebration-card"
          >
            {/* Celebration GIF Placeholder */}
            <div className="relative w-36 h-36 mb-6 rounded-full overflow-hidden bg-pink-50 border-4 border-white shadow-sm flex items-center justify-center">
              {/* 
                REMINDER: Replace celebration-animation.gif with a happy/celebrating dance GIF 
              */}
              <img
                src="celebration-animation.gif"
                alt="Celebration Dance"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("celebration-gif-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                id="celebration-gif-fallback"
                className="hidden absolute inset-0 flex flex-col items-center justify-center text-pink-400 bg-pink-50/50"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-pink-400 fill-current" />
                </motion.div>
              </div>
            </div>

            {/* Main Couple Photo Framed */}
            <div className="relative w-full max-w-sm aspect-[4/3] mb-8 rounded-2xl overflow-hidden bg-rose-50 border-8 border-white shadow-[0_15px_35px_rgba(244,63,94,0.12)] flex items-center justify-center group">
              {/* 
                REMINDER: Replace couple-photo.jpg with a photo of you two 
              */}
              <img
                src="couple-photo.jpg"
                alt="Our Memories"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.getElementById("couple-photo-fallback");
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                id="couple-photo-fallback"
                className="hidden absolute inset-0 flex flex-col items-center justify-center text-rose-300 bg-gradient-to-br from-rose-50 to-pink-100 p-6"
              >
                <Heart className="w-16 h-16 fill-current text-rose-300 animate-pulse" />
                <span className="text-sm font-medium text-rose-500 mt-4 italic">Our Photo Placeholder 💖</span>
              </div>
              
              {/* Decorative overlay border / heart-shaped vignette */}
              <div className="absolute inset-0 border border-pink-200/20 rounded-lg pointer-events-none"></div>
            </div>

            {/* Elegant Shayari */}
            <div className="mb-6 px-4">
              <p className="font-caveat text-2xl sm:text-3xl text-rose-800 leading-relaxed font-semibold italic drop-shadow-sm select-none">
                "Main agar chahoon bhi toh shayad na likh paaoon un lafzon ko,<br/>
                Jo bayaan kar sakein ki tum mere liye kitne khaas ho. ❤️"
              </p>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-pink-600 font-semibold text-base sm:text-lg flex items-center gap-1.5 justify-center select-none"
            >
              I knew you'd say yes! 😉
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti / Hearts screen-wide animation */}
      <AnimatePresence>
        {accepted && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{
                  y: -50,
                  x: `${heart.left}vw`,
                  scale: 0,
                  rotate: 0,
                  opacity: 0
                }}
                animate={{
                  y: "105vh",
                  scale: 1,
                  rotate: Math.random() * 360 + 180,
                  opacity: [0, 1, 1, 0.8, 0]
                }}
                transition={{
                  duration: heart.duration,
                  delay: heart.delay,
                  ease: "linear",
                  repeat: Infinity
                }}
                className={`absolute ${heart.colorClass}`}
                style={{
                  fontSize: `${heart.size}px`,
                  top: 0
                }}
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

