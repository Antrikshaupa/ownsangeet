import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MusicPlayer from "./MusicPlayer";

type PhotoAudioProps = {
  imageSrc: string;
  alt: string;
  audioSrc: string;
};

export function PhotoAudio({ imageSrc, alt, audioSrc }: PhotoAudioProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="cursor-pointer w-full h-full object-cover rounded-lg"
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4 rounded-lg z-10"
          >
            <MusicPlayer
              audioSrc={audioSrc}
              songName={alt}
              artistName="Own Sangeet"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
