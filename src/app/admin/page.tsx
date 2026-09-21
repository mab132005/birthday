"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { birthdayConfig } from "@/config/birthday";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [quizSelections, setQuizSelections] = useState<Record<number, string>>({});
  const [heartAnswers, setHeartAnswers] = useState<string[]>(
    Array(birthdayConfig.openQuestions.length).fill("")
  );

  useEffect(() => {
    const savedAnswers = localStorage.getItem("birthday-heart-answers");
    if (savedAnswers) {
      try {
        setHeartAnswers(JSON.parse(savedAnswers));
      } catch {
        // Ignore malformed data
      }
    }

    const savedSelections = localStorage.getItem("birthday-quiz-selections");
    if (savedSelections) {
      try {
        setQuizSelections(JSON.parse(savedSelections));
      } catch {
        // Ignore malformed data
      }
    }
  }, []);

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

  const handleUnlock = () => {
    if (!password.trim()) {
      setPasswordError("اكتبي كلمة السر أولًا ❤️");
      return;
    }

    if (password.trim() !== birthdayConfig.password) {
      setPasswordError("كلمة السر غلط... حاول تاني 😌");
      return;
    }

    setPasswordError("");
    setIsUnlocked(true);
  };

  if (!isUnlocked) {
    return (
      <main className="story-shell">
        <div className="screen">
          <div className="content-panel large">
            <div className="badge">Admin Area</div>

            <h1 className="hero-title">Admin</h1>

            <p className="subtitle">اكتب كلمة السر علشان تفتح إجابات الحبيب ❤️</p>

            <div className="input-wrap">
              <input
                aria-label="Admin password input"
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

            <button className="romantic-btn" onClick={handleUnlock}>
              دخول ❤️
            </button>

            <div className="actions-row">
              <Link href="/" className="ghost-btn" style={{ textDecoration: "none", textAlign: "center" }}>
                الرجوع للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="story-shell">
      <div className="screen">
        <div className="content-panel large">
          <div className="badge">Admin</div>

          <h1 className="section-title">الإجابات المخزنة</h1>

          <div className="question-box">
            {quizGroups.map((group) => {
              const answeredQuestions = group.questions.filter((question) => {
                return quizSelections[question.id];
              });

              if (answeredQuestions.length === 0) {
                return null;
              }

              return (
                <div key={group.category} style={{ marginBottom: 28 }}>
                  <div className="quiz-header">
                    <div className="quiz-category-label">{group.category}</div>
                  </div>

                  {answeredQuestions.map((question) => (
                    <div
                      key={question.id}
                      style={{
                        marginTop: 10,
                        padding: "12px 14px",
                        borderRadius: 16,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p
                        className="subtitle"
                        style={{ textAlign: "right", margin: 0, fontWeight: 700 }}
                      >
                        {question.question}
                      </p>
                      <p
                        className="subtitle"
                        style={{ textAlign: "right", margin: "8px 0 0" }}
                      >
                        الإجابة: {quizSelections[question.id]}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}

            {birthdayConfig.openQuestions.map((question, index) => {
              const answer = heartAnswers[index]?.trim();

              if (!answer) {
                return null;
              }

              return (
                <div
                  key={question}
                  style={{
                    marginTop: 18,
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="subtitle"
                    style={{ textAlign: "right", margin: 0, fontWeight: 700 }}
                  >
                    {question}
                  </p>
                  <p
                    className="subtitle"
                    style={{ textAlign: "right", margin: "8px 0 0" }}
                  >
                    الإجابة: {answer}
                  </p>
                </div>
              );
            })}

            {Object.keys(quizSelections).length === 0 &&
              heartAnswers.every((answer) => !answer.trim()) && (
                <p className="subtitle">ما فيش إجابات محفوظة لحد دلوقتي.</p>
              )}
          </div>

          <div className="actions-row">
            <Link href="/" className="ghost-btn" style={{ textDecoration: "none", textAlign: "center" }}>
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
