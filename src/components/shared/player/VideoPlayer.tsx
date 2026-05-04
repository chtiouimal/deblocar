"use client";

import { useState, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import styles from "./player.module.css";

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  playButton?: ReactNode;
}

export function VideoPlayer({ url, thumbnail, playButton }: VideoPlayerProps) {
  const [opened, setOpened] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  const handleClose = () => {
    // force stop before unmount
    playerRef.current?.getInternalPlayer()?.pause();
    setOpened(false);
  };

  useEffect(() => {
    if (!opened) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [opened]);

  useEffect(() => {
    document.body.style.overflow = opened ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <>
      <div className={styles.trigger} onClick={() => setOpened(true)}>
        {thumbnail && (
          <img
            src={thumbnail}
            alt="video thumbnail"
            className={styles.thumbnail}
          />
        )}
        <div className={styles.triggerOverlay}>
          {playButton ?? <DefaultPlayButton />}
        </div>
      </div>

      {opened &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div className={styles.modal}>
              <button
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M1 1L17 17M17 1L1 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <ReactPlayer
                ref={playerRef}
                url={url}
                playing
                controls
                width="100%"
                height="100%"
                config={{
                  file: { attributes: { controlsList: "nodownload" } },
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function DefaultPlayButton() {
  return (
    <div className={styles.defaultPlayBtn}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="6,2 26,14 6,26" fill="white" />
      </svg>
    </div>
  );
}
