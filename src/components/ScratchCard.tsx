"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

interface ScratchCardProps {
  title: string;
  subtitle: string;
  coverText: string;
  hiddenSecret: string;
  buttonText: string;
  onComplete: () => void;
}

export default function ScratchCard({
  title,
  subtitle,
  coverText,
  hiddenSecret,
  buttonText,
  onComplete,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height || 180;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create metallic rose gold gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#fb7185");
    grad.addColorStop(0.5, "#e11d48");
    grad.addColorStop(1, "#881337");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add sparkly pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add cover text
    ctx.font = "bold 18px var(--font-cairo), sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(coverText, width / 2, height / 2);
  }, [coverText]);

  const checkScratchedPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampledPixels = pixels.length / 16;
    const percentage = (transparentCount / totalSampledPixels) * 100;

    setScratchProgress(percentage);

    if (percentage > 35 && !isRevealed) {
      setIsRevealed(true);
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    checkScratchedPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="scratch-card-container">
      <div className="badge">
        <Sparkles size={16} />
        {title}
      </div>

      <p className="subtitle" style={{ marginBottom: 16 }}>
        {subtitle}
      </p>

      <div ref={containerRef} className="scratch-card-box">
        {/* Hidden Secret Message underneath */}
        <div className="scratch-secret-content">
          <Gift size={36} className="text-rose-400" />
          <p className="scratch-secret-text">{hiddenSecret}</p>
        </div>

        {/* Top Scratch Canvas */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </div>

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="scratch-success-badge"
        >
          ✨ مبروك! انشفت المفاجأة ❤️
        </motion.div>
      )}

      <button
        className="romantic-btn"
        style={{ marginTop: 20 }}
        onClick={onComplete}
      >
        {buttonText}
      </button>
    </div>
  );
}
