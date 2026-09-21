"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { GalleryPhoto } from "@/config/birthday";

interface PhotoMarqueeProps {
  photos: GalleryPhoto[];
}

export default function PhotoMarquee({ photos }: PhotoMarqueeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-slide every 3 seconds if not paused
  useEffect(() => {
    if (isPaused || photos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused, photos.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div
      className="coverflow-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="coverflow-stage">
        <button
          className="coverflow-arrow left"
          onClick={handlePrev}
          aria-label="Previous photo"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="coverflow-cards-wrap">
          <AnimatePresence mode="popLayout" initial={false}>
            {[-1, 0, 1].map((offset) => {
              const photoIndex =
                (currentIndex + offset + photos.length) % photos.length;
              const photo = photos[photoIndex];
              if (!photo) return null;

              const isCenter = offset === 0;

              return (
                <motion.div
                  key={`${photo.id}-${offset}`}
                  initial={{
                    opacity: 0,
                    x: offset * 110,
                    scale: 0.75,
                    rotateY: offset * 25,
                  }}
                  animate={{
                    opacity: isCenter ? 1 : 0.55,
                    x: offset * 105,
                    scale: isCenter ? 1 : 0.82,
                    rotateY: offset * -20,
                    zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                  }}
                  exit={{
                    opacity: 0,
                    x: offset * 110,
                    scale: 0.75,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                  }}
                  className={`coverflow-card ${isCenter ? "active" : ""}`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="coverflow-photo-frame">
                    <img src={photo.url} alt={photo.alt} loading="lazy" />
                    <div className="photo-heart-badge">
                      <Heart size={14} fill="#e11d48" color="#e11d48" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          className="coverflow-arrow right"
          onClick={handleNext}
          aria-label="Next photo"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Counter & Indicator dots */}
      <div className="coverflow-counter">
        <span>
          صورة {currentIndex + 1} من {photos.length}
        </span>
      </div>

      {/* Lightbox Modal via Portal */}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {selectedPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="photo-lightbox-overlay"
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="photo-lightbox-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="lightbox-close-btn"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X size={20} />
                  </button>

                  <div className="lightbox-image-wrap">
                    <img src={selectedPhoto.url} alt={selectedPhoto.alt} />
                  </div>

                  <div className="lightbox-footer">
                    <Heart size={20} className="text-rose-400" fill="#f43f5e" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
