'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const useSound = (url: string) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    audio.current = new Audio(url);
    const handleCanPlay = () => setCanPlay(true);
    audio.current.addEventListener('canplaythrough', handleCanPlay);
    return () => audio.current?.removeEventListener('canplaythrough', handleCanPlay);
  }, [url]);

  const play = () => {
    if (audio.current && canPlay) {
      audio.current.currentTime = 0;
      audio.current.play().catch(error => {
        if (error.name === 'NotAllowedError') {
          console.warn('Audio playback was not allowed. User interaction is required.');
        } else {
          console.error("Error playing sound:", error);
        }
      });
    }
  };

  return play;
};

const initialDoors = ['open-door-1.png', 'open-door-2.png', 'open-door-3.png'];

const Door = ({ isOpen, number, openDoorSrc, playSound, gameStarted }: { isOpen: boolean; number: number; openDoorSrc: string; playSound: () => void; gameStarted: boolean }) => {
  useEffect(() => {
    if (isOpen && gameStarted) {
      playSound();
    }
  }, [isOpen, playSound, gameStarted]);

  return (
    <div className="relative w-64 h-96">
       <Image
        src={openDoorSrc}
        alt="Open Door"
        fill
        objectFit="cover"
        className={`${isOpen ? 'opacity-100 z-10' : 'opacity-0'}`}
        aria-label={`Door ${number}`}
      />
      <Image
        src="/closed-door.png"
        alt="Closed Door"
        fill
        objectFit="cover"
        className={`${isOpen ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

export default function Home() {
  const [openDoors, setOpenDoors] = useState([false, false, false]);
  const [openDoorSrcs, setOpenDoorSrcs] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const playDoorSound = useSound('/door-open.ogg');

  const startGame = () => {
    setGameStarted(true);
    const shuffledDoors = [...initialDoors].sort(() => Math.random() - 0.5);
    setOpenDoorSrcs(shuffledDoors);

    [2, 3, 4].forEach((baseDelay, index) => {
      const delay = baseDelay + Math.random() * 8;
      setTimeout(() => {
        setOpenDoors(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, delay * 1000);
    });
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1B191A]">
        <div 
          onClick={startGame}
          className="cursor-pointer"
          data-test="start-game-button"
        >
          <Image
            src="/start.png"
            alt="Start Game"
            width={200}
            height={80}
          />
        </div>
      </div>
    );
  }

  if (openDoorSrcs.length !== 3) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1B191A]">
      <div className="flex space-x-12">
        {openDoors.map((isOpen, index) => (
          <Door 
            key={index} 
            isOpen={isOpen} 
            number={index + 1} 
            openDoorSrc={`/${openDoorSrcs[index]}`} 
            playSound={playDoorSound}
            gameStarted={gameStarted}
          />
        ))}
      </div>
    </div>
  );
}
