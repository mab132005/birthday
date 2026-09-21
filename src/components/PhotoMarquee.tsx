"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { GalleryPhoto } from "@/config/birthday";

interface PhotoMarqueeProps {
  photos: GalleryPhoto[];
}

export default function PhotoMarquee({ photos }: PhotoMarqueeProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = photos.length;
  const radius = useMemo(() => {
    if (total <= 1) return 180;
    const cardWidth = 120;
    const calcRadius = Math.round(cardWidth / (2 * Math.tan(Math.PI / total)));
    return Math.max(calcRadius + 40, 260);
  }, [total]);

  const angleStep = 360 / total;

  return (
    <div className="photo-ring-stage">
      <div className="photo-ring-spinner">
        {photos.map((photo, index) => {
          const angle = index * angleStep;
          return (
            <div
              key={photo.id}
              className="photo-ring-item"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="photo-frame ring-frame">
                <img src={photo.url} alt={photo.alt} loading="lazy" />
                <div className="photo-heart-badge">
                  <Heart size={12} fill="#e11d48" color="#e11d48" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal rendered directly in document.body via Portal */}
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
