"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Gift,
  Heart,
  Image as ImageIcon,
  Lock,
  Mail,
  Pause,
  Play,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { birthdayConfig } from "@/config/birthday";
import ConfettiEffect from "@/components/ConfettiEffect";
import PhotoMarquee from "@/components/PhotoMarquee";
import ScratchCard from "@/components/ScratchCard";
import { playSfx } from "@/utils/sfx";

type Screen =
  | "password"
  | "welcome"
  | "first-letter"
  | "memories"
  | "quiz"
  | "quiz-result"
  | "heart-questions"
  | "love-reasons"
  | "scratch-card"
  | "gift"
  | "letter"
  | "final";

type QuizFeedback = {
  type: "correct" | "wrong";
  message: string;
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("password");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizGroupIndex, setQuizGroupIndex] = useState(0);
  const [quizSelections, setQuizSelections] = useState<Record<number, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<QuizFeedback | null>(null);
  const [heartAnswers, setHeartAnswers] = useState<string[]>(
    Array(birthdayConfig.openQuestions.length).fill("")
  );
  const [heartIndex, setHeartIndex] = useState(0);
  const [loveReasonIndex, setLoveReasonIndex] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finalReply, setFinalReply] = useState("");
  const [replySent, setReplySent] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const quizGroups = useMemo(() => {
    const groups: Array<{ category: string; questions: typeof birthdayConfig.quizQuestions }> = [];
    let currentGroup:
      | { category: string; questions: typeof birthdayConfig.quizQuestions }
      | undefined;

    birthdayConfig.quizQuestions.forEach((question) => {
      if (!currentGroup || currentGroup.category !== question.category) {
        currentGroup = {
          category: question.category,
          questions: [],
        };
        groups.push(currentGroup);
      }

      currentGroup.questions.push(question);
    });

    return groups;
  }, []);

  const currentGroup = quizGroups[quizGroupIndex];
  const currentQuestion = currentGroup?.questions[quizIndex];
  const totalQuestions = currentGroup?.questions.length ?? 0;
  const totalScorableQuestions =
    currentGroup?.questions.filter((question) => question.correctAnswer).length ?? 0;
  const currentGroupScore =
    currentGroup?.questions.filter(
      (question) =>
        question.correctAnswer && quizSelections[question.id] === question.correctAnswer
    ).length ?? 0;

  useEffect(() => {
    const savedUnlocked = sessionStorage.getItem("birthday-unlocked");
    if (savedUnlocked === "true") {
      setScreen("welcome");
    }

    const savedAnswers = localStorage.getItem("birthday-heart-answers");
    if (savedAnswers) {
      try {
        setHeartAnswers(JSON.parse(savedAnswers));
      } catch {
        // Ignore
      }
    }

    const savedSelections = localStorage.getItem("birthday-quiz-selections");
    if (savedSelections) {
      try {
        setQuizSelections(JSON.parse(savedSelections));
      } catch {
        // Ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("birthday-heart-answers", JSON.stringify(heartAnswers));
  }, [heartAnswers]);

  useEffect(() => {
    localStorage.setItem("birthday-quiz-selections", JSON.stringify(quizSelections));
  }, [quizSelections]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  const startMusic = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Play music automatically once unlocked (when entering welcome/story screen)
    if (screen !== "password") {
      void startMusic();
    }
  }, [screen]);

  const sendHeartAnswersToBot = async (answersToSubmit: string[]) => {
    try {
      const formattedAnswers = birthdayConfig.openQuestions.map((q, idx) => ({
        question: q,
        answer: answersToSubmit[idx] || "",
      }));

      await fetch("/api/send-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "heart-answers",
          herName: birthdayConfig.herName,
          answers: formattedAnswers,
        }),
      });
    } catch {
      // Ignore background notification errors
    }
  };

  const sendFinalReplyToBot = async () => {
    if (!finalReply.trim()) return;

    playSfx("success");
    try {
      await fetch("/api/send-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "final-reply",
          herName: birthdayConfig.herName,
          message: finalReply,
        }),
      });
      setReplySent(true);
    } catch {
      setReplySent(true);
    }
  };

  const handlePasswordSubmit = () => {
    playSfx("click");
    if (!password.trim()) {
      setPasswordError("اكتبي كلمة السر أولًا ❤️");
      playSfx("pop");
      return;
    }

    if (password.trim() !== birthdayConfig.password) {
      setPasswordError("مممم... حاولي تاني 😌❤️");
      playSfx("pop");
      return;
    }

    setPasswordError("");
    sessionStorage.setItem("birthday-unlocked", "true");
    setScreen("welcome");
    playSfx("success");
    void startMusic();
  };

  const handleQuizOption = (option: string) => {
    if (!currentQuestion) return;

    const nextSelections = { ...quizSelections, [currentQuestion.id]: option };
    setQuizSelections(nextSelections);

    if (currentQuestion.correctAnswer) {
      const isCorrect = option === currentQuestion.correctAnswer;

      if (isCorrect) {
        playSfx("success");
        setQuizFeedback({
          type: "correct",
          message: currentQuestion.successMessage || "",
        });
      } else {
        playSfx("pop");
        setQuizFeedback({
          type: "wrong",
          message: currentQuestion.wrongMessage || "",
        });
      }
    } else {
      playSfx("click");
      setQuizFeedback(null);
    }

    const nextIndex = quizIndex + 1;
    const delay = currentQuestion.correctAnswer ? 850 : 260;

    if (nextIndex < totalQuestions) {
      setTimeout(() => {
        setQuizIndex(nextIndex);
        setQuizFeedback(null);
      }, delay);
      return;
    }

    setTimeout(() => {
      setScreen("quiz-result");
      setQuizFeedback(null);
    }, delay);
  };

  const handleHeartAnswer = (value: string) => {
    const nextAnswers = [...heartAnswers];
    nextAnswers[heartIndex] = value;
    setHeartAnswers(nextAnswers);
  };

  const handleNextHeartQuestion = () => {
    playSfx("click");
    if (!heartAnswers[heartIndex].trim()) {
      return;
    }

    if (heartIndex < birthdayConfig.openQuestions.length - 1) {
      setHeartIndex((prev) => prev + 1);
      return;
    }

    playSfx("success");
    void sendHeartAnswersToBot(heartAnswers);
    setScreen("love-reasons");
  };

  const handlePrevHeartQuestion = () => {
    playSfx("click");
    if (heartIndex > 0) {
      setHeartIndex((prev) => prev - 1);
    }
  };

  const scoreMessage = useMemo(() => {
    if (totalScorableQuestions === 0) {
      return "تم إنهاء هذا الجزء، وده أول خطوة في الحكاية ❤️";
    }

    if (currentGroupScore >= Math.ceil(totalScorableQuestions * 0.75)) {
      return "واضح إنك عارفاني كويس جدًا ❤️";
    }

    if (currentGroupScore >= Math.ceil(totalScorableQuestions * 0.5)) {
      return "مش بطالة خالص 😌❤️";
    }

    return "😂 محتاجين نراجع شوية حاجات!";
  }, [currentGroupScore, totalScorableQuestions]);

  const progressPercentage = totalQuestions
    ? ((quizIndex + 1) / totalQuestions) * 100
    : 0;

  const handleQuizResultAction = () => {
    playSfx("click");
    if (quizGroupIndex < quizGroups.length - 1) {
      setQuizGroupIndex((prev) => prev + 1);
      setQuizIndex(0);
      setScreen("quiz");
      return;
    }

    setScreen("heart-questions");
  };

  return (
    <main className="story-shell">
      {showConfetti && <ConfettiEffect />}

      <audio
        ref={audioRef}
        src={encodeURI(birthdayConfig.musicPath)}
        preload="auto"
        loop
        muted={muted}
      />

      <div className="stars-layer" />
      <div className="hearts-layer" />
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      <div className="top-controls">
        {screen !== "password" && screen !== "final" ? (
          <button
            className="back-btn"
            onClick={() => {
              playSfx("click");
              if (screen === "welcome") {
                setScreen("password");
              } else if (screen === "first-letter") {
                setScreen("welcome");
              } else if (screen === "memories") {
                setScreen("first-letter");
              } else if (screen === "quiz") {
                setScreen("memories");
              } else if (screen === "quiz-result") {
                setScreen("quiz");
              } else if (screen === "heart-questions") {
                setScreen("quiz-result");
              } else if (screen === "love-reasons") {
                setScreen("heart-questions");
              } else if (screen === "scratch-card") {
                setScreen("love-reasons");
              } else if (screen === "letter") {
                setScreen("scratch-card");
              }
            }}
          >
            <ArrowLeft size={16} />
            <span>رجوع</span>
          </button>
        ) : (
          <div />
        )}

        {screen !== "password" && (
          <div className="media-controls-wrap">
            <button
              className="mini-player"
              onClick={() => {
                playSfx("click");
                if (isPlaying) {
                  audioRef.current?.pause();
                  setIsPlaying(false);
                } else {
                  void startMusic();
                }
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? "إيقاف" : "تشغيل"}</span>
            </button>

            <button
              className="mini-player"
              onClick={() => {
                playSfx("click");
                setMuted((prev) => !prev);
              }}
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{muted ? "صوت" : "كتم"}</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {screen === "password" && (
          <motion.section
            key="password"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6 }}
            className="screen"
          >
            <div className="content-panel large">
              <div className="badge">
                <Lock size={18} />
                المكان ده معمول لشخص واحد بس هو انتي يا ...
              </div>

              <motion.h1
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="hero-title"
              >
                {birthdayConfig.herName} <span>❤️</span>
              </motion.h1>

              <p className="subtitle">عندي حاجة عايز أوريهالك</p>

              <div className="input-wrap">
                <input
                  aria-label="Password input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`romantic-input ${passwordError ? "shake" : ""}`}
                  placeholder="اكتبي كلمة السر..."
                />
              </div>

              {passwordError && <p className="error-text">{passwordError}</p>}

              <button className="romantic-btn" onClick={handlePasswordSubmit}>
                دخول ❤️
              </button>
            </div>
          </motion.section>
        )}

        {screen === "welcome" && (
          <motion.section
            key="welcome"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel large">
              <div className="badge">
                <Sparkles size={18} />
                قصة صغيرة
              </div>

              {birthdayConfig.welcomeLines.map((line, index) => (
                <motion.p
                  key={line + index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.45, duration: 0.5 }}
                  className={`welcome-line ${index === 3 ? "name" : ""}`}
                >
                  {line.replace("[HER_NAME]", birthdayConfig.herName)}
                </motion.p>
              ))}

              <button
                className="romantic-btn"
                onClick={() => {
                  playSfx("click");
                  void startMusic();
                  setScreen("first-letter");
                }}
              >
                ابدئي الحكاية ✨
              </button>
            </div>
          </motion.section>
        )}

        {screen === "first-letter" && (
          <motion.section
            key="first-letter"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel">
              <div className="envelope-wrapper">
                <motion.div
                  className="envelope"
                  initial={{ rotateY: 0, y: 0 }}
                  animate={{ rotateY: 180, y: -8 }}
                  transition={{ duration: 1.2 }}
                >
                  <Mail size={84} />
                </motion.div>
              </div>

              {birthdayConfig.firstLetterLines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.14, duration: 0.42 }}
                  className="subtitle"
                >
                  {line}
                </motion.p>
              ))}

              <button
                className="romantic-btn"
                onClick={() => {
                  playSfx("click");
                  setScreen("memories");
                }}
              >
                كمّلي...
              </button>
            </div>
          </motion.section>
        )}

        {screen === "memories" && (
          <motion.section
            key="memories"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel large" style={{ textAlign: "center" }}>
              <div className="badge">
                <ImageIcon size={18} />
                لحظات حلوة
              </div>

              <h2 className="section-title">صور حكايتنا ❤️</h2>
              <p className="subtitle">
                المشوار لسه في أوله، ولسه مستنيانا صور ورسائل أكتر كتير جاية سوا ✨
              </p>

              {/* Infinite Photo Marquee Mobile Component */}
              <PhotoMarquee photos={birthdayConfig.galleryPhotos} />

              <button
                className="romantic-btn"
                onClick={() => {
                  playSfx("click");
                  setScreen("quiz");
                }}
              >
                ادخلي للكويز 😌❤️
              </button>
            </div>
          </motion.section>
        )}

        {screen === "quiz" && currentQuestion && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen quiz-screen"
          >
            <div className="quiz-header">
              <div className="quiz-category-label">{currentQuestion.category}</div>
            </div>

            <div className="content-panel">
              <div className="badge">
                السؤال {quizIndex + 1} من {totalQuestions}
              </div>

              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="question-box"
              >
                <p className="question-text">{currentQuestion.question}</p>

                <div className="options-grid">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      className={`option-btn ${
                        quizSelections[currentQuestion.id] === option ? "selected" : ""
                      }`}
                      onClick={() => handleQuizOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>

              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`feedback-box ${quizFeedback.type}`}
                >
                  {quizFeedback.message}
                </motion.div>
              )}

              {quizIndex > 0 && (
                <div className="actions-row">
                  <button
                    className="ghost-btn"
                    onClick={() => {
                      playSfx("click");
                      setQuizIndex((prev) => prev - 1);
                      setQuizFeedback(null);
                    }}
                  >
                    السابق
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {screen === "quiz-result" && currentGroup && (
          <motion.section
            key="quiz-result"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel">
              <div className="badge">
                {totalScorableQuestions > 0
                  ? `نتيجة ${currentGroup.category}`
                  : `تم إنهاء ${currentGroup.category}`}
              </div>

              {totalScorableQuestions > 0 ? (
                <>
                  <h2 className="section-title">
                    {currentGroupScore} / {totalScorableQuestions} ❤️
                  </h2>

                  <p className="subtitle">{scoreMessage}</p>

                  <div className="result-box">
                    <p>{scoreMessage}</p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="section-title">تم إنهاء هذا الجزء ✅</h2>
                  <p className="subtitle">{currentGroup.category}</p>

                  <div className="result-box">
                    <p>الجزء ده خلّى الحكاية أحلى، ودي بداية الجزء التالي ❤️</p>
                  </div>
                </>
              )}

              <button className="romantic-btn" onClick={handleQuizResultAction}>
                {quizGroupIndex < quizGroups.length - 1
                  ? "الجزء التالي..."
                  : "دلوقتي دوري اتعرف عليكي اكتر ❤️"}
              </button>
            </div>
          </motion.section>
        )}

        {screen === "heart-questions" && (
          <motion.section
            key="heart-questions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel">
              <div className="badge">
                سؤال {heartIndex + 1} من {birthdayConfig.openQuestions.length}
              </div>

              <h2 className="section-title">دلوقتي أنا عايز أعرفك أكتر ❤️</h2>

              <div className="question-box">
                <p className="question-text">
                  {birthdayConfig.openQuestions[heartIndex]}
                </p>

                <textarea
                  value={heartAnswers[heartIndex]}
                  onChange={(e) => handleHeartAnswer(e.target.value)}
                  className="romantic-textarea"
                  placeholder="اكتبي إجابتك هنا..."
                />

                <div className="actions-row">
                  {heartIndex > 0 && (
                    <button className="ghost-btn" onClick={handlePrevHeartQuestion}>
                      السابق
                    </button>
                  )}

                  <button className="romantic-btn" onClick={handleNextHeartQuestion}>
                    {heartIndex === birthdayConfig.openQuestions.length - 1
                      ? "كمّلي..."
                      : "التالي ❤️"}
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {screen === "love-reasons" && (
          <motion.section
            key="love-reasons"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel">
              <div className="badge">
                سبب {loveReasonIndex + 1} من {birthdayConfig.loveReasons.length}
              </div>

              <h2 className="section-title">تعرفي إيه أكتر حاجة بحبها فيكي؟ ❤️</h2>

              <motion.div
                key={loveReasonIndex}
                initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.45 }}
                className="love-card"
              >
                <Heart size={34} />
                <p>{birthdayConfig.loveReasons[loveReasonIndex]}</p>
              </motion.div>

              <button
                className="romantic-btn"
                onClick={() => {
                  playSfx("click");
                  if (loveReasonIndex < birthdayConfig.loveReasons.length - 1) {
                    setLoveReasonIndex((prev) => prev + 1);
                  } else {
                    playSfx("success");
                    setScreen("scratch-card");
                  }
                }}
              >
                {loveReasonIndex === birthdayConfig.loveReasons.length - 1
                  ? "في مفاجأة صغيرة... 🎁"
                  : "Next →"}
              </button>
            </div>
          </motion.section>
        )}

        {screen === "scratch-card" && (
          <motion.section
            key="scratch-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel">
              <ScratchCard
                title={birthdayConfig.scratchCardConfig.title}
                subtitle={birthdayConfig.scratchCardConfig.subtitle}
                coverText={birthdayConfig.scratchCardConfig.coverText}
                hiddenSecret={birthdayConfig.scratchCardConfig.hiddenSecret}
                buttonText={birthdayConfig.scratchCardConfig.buttonText}
                onComplete={() => {
                  playSfx("gift");
                  setShowConfetti(true);
                  setScreen("letter");
                }}
              />
            </div>
          </motion.section>
        )}

        {screen === "letter" && (
          <motion.section
            key="letter"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel letter-panel">
              <div className="badge">إلى حبيبتي ❤️</div>

              <h2 className="section-title">إلى حبيبتي ❤️</h2>

              {birthdayConfig.mainLetterLines.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.22, duration: 0.4 }}
                  className="letter-line"
                >
                  {line.replace("[HER_NAME]", birthdayConfig.herName)}
                </motion.p>
              ))}

              <button
                className="romantic-btn"
                onClick={() => {
                  playSfx("gift");
                  setShowConfetti(true);
                  setScreen("final");
                }}
              >
                أتمم القصة ❤️
              </button>
            </div>
          </motion.section>
        )}

        {screen === "final" && (
          <motion.section
            key="final"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="screen"
          >
            <div className="content-panel large final-panel">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="final-title"
              >
                {birthdayConfig.finalTitle}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="final-name"
              >
                {birthdayConfig.herName}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="subtitle"
              >
                {birthdayConfig.finalSubtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="subtitle"
              >
                {birthdayConfig.finalClosing}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="ending"
              >
                I Love You ❤️
              </motion.p>

              {/* Reply Message Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                style={{ marginTop: 28, textAlign: "center" }}
              >
                <p className="subtitle" style={{ fontWeight: 700 }}>
                  حابة تقوليلي كلمة أو رسالة؟ 💌
                </p>

                {!replySent ? (
                  <div style={{ marginTop: 12 }}>
                    <textarea
                      value={finalReply}
                      onChange={(e) => setFinalReply(e.target.value)}
                      className="romantic-textarea"
                      placeholder="اكتبي رسالتك هنا..."
                      style={{ minHeight: 100 }}
                    />
                    <button
                      className="romantic-btn"
                      onClick={sendFinalReplyToBot}
                      disabled={!finalReply.trim()}
                      style={{
                        marginTop: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Send size={16} />
                      إرسال الرسالة ❤️
                    </button>
                  </div>
                ) : (
                  <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="subtitle"
                    style={{ color: "#f5bfd1", fontWeight: 800, marginTop: 14 }}
                  >
                    وصلتني رسالتك الرائعة! بحبك جدًا ❤️✨
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
