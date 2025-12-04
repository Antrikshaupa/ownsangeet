import React, { useState, useRef, useEffect } from "react";

type MusicPlayerProps = {
  audioSrc: string;
  songName: string;
  artistName: string;
};

const MusicPlayer = ({ audioSrc, songName, artistName }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener("loadeddata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);

      if (audio.readyState >= 2) {
        // if metadata is already loaded
        setAudioData();
      }

      // Auto-play when component mounts
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Autoplay failed:", e));

      return () => {
        audio.removeEventListener("loadeddata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
      };
    }
  }, [audioSrc]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center group/he select-none">
      <audio ref={audioRef} src={audioSrc} preload="metadata"></audio>
      {/* Collapsed spinning disc */}
      <div className="relative z-0 h-16 -mb-2 transition-all duration-200 group-hover/he:h-0">
        <svg
          width={128}
          height={128}
          viewBox="0 0 128 128"
          className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all"
        >
          <rect width={128} height={128} fill="black" />
          <circle cx={20} cy={20} r={2} fill="white" />
          <circle cx={40} cy={30} r={2} fill="white" />
          <circle cx={60} cy={10} r={2} fill="white" />
          <circle cx={80} cy={40} r={2} fill="white" />
          <circle cx={100} cy={20} r={2} fill="white" />
          <circle cx={120} cy={50} r={2} fill="white" />
          <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
          <circle cx={90} cy={30} r={8} fill="white" />
        </svg>
        <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12" />
      </div>

      {/* Expanded Player */}
      <div className="z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-40 group-hover/he:w-72 rounded-2xl shadow-zinc-400">
        <div className="flex flex-row w-full h-0 group-hover/he:h-20">
          <div className="relative flex items-center justify-center w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:opacity-100 transition-all duration-100">
            <svg
              width={96}
              height={96}
              viewBox="0 0 128 128"
              className={`duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 ${
                isPlaying ? "animate-[spin_3s_linear_infinite]" : ""
              }`}
            >
              <rect width={128} height={128} fill="black" />
              <circle cx={20} cy={20} r={2} fill="white" />
              <circle cx={40} cy={30} r={2} fill="white" />
              <circle cx={60} cy={10} r={2} fill="white" />
              <circle cx={80} cy={40} r={2} fill="white" />
              <circle cx={100} cy={20} r={2} fill="white" />
              <circle cx={120} cy={50} r={2} fill="white" />
              <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
              <circle cx={90} cy={30} r={8} fill="white" />
            </svg>
            <div className="absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9" />
          </div>
          <div className="flex flex-col justify-center w-full pl-3 -ml-24 overflow-hidden group-hover/he:-ml-3 text-nowrap">
            <p className="text-xl font-bold">{songName}</p>
            <p className="text-zinc-600">{artistName}</p>
          </div>
        </div>
        <div className="flex flex-row mx-3 mt-3 bg-indigo-100 rounded-md min-h-4 group-hover/he:mt-0">
          <span className="hidden pl-3 text-sm text-zinc-600 group-hover/he:inline-block">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-24 group-hover/he:w-full flex-grow h-1 mx-2 my-auto bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
          <span className="hidden pr-3 text-sm text-zinc-600 group-hover/he:inline-block">
            {formatTime(duration)}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center flex-grow mx-3 space-x-5">
          {/* Previous Button */}
          <div className="flex items-center justify-center w-12 h-full cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-skip-back"
            >
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1={5} y1={19} x2={5} y2={5} />
            </svg>
          </div>
          {/* Play/Pause Button */}
          <label className="flex items-center justify-center w-12 h-full cursor-pointer">
            <input
              type="checkbox"
              checked={isPlaying}
              onChange={togglePlayPause}
              className="hidden peer/playStatus"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-play peer-checked/playStatus:hidden"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hidden feather feather-pause peer-checked/playStatus:inline-block"
            >
              <rect x={6} y={4} width={4} height={16} />
              <rect x={14} y={4} width={4} height={16} />
            </svg>
          </label>
          {/* Next Button */}
          <div className="flex items-center justify-center w-12 h-full cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-skip-forward"
            >
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1={19} y1={5} x2={19} y2={19} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
