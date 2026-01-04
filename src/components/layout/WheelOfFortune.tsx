"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const WheelOfFortune = () => {
  const [showWinningItem, setShowWinningItem] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      {/* Added bg-white so the card is solid, not transparent */}
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogTitle className="sr-only">
          Spin & Win
          <div className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2 animate-bounce">
              Spin & Win! 🎁
            </h2>
            <p className="text-muted-foreground mb-4 relative animate-pulse">
              Try your luck! Spin the wheel for a chance to win exciting prizes!
            </p>
            <div className="absolute -left-10 top-1/2 h-8 w-40 bg-white/20 rotate-45 animate-[shine_2s_infinite]" />
          </div>
        </DialogTitle>

        <div className="flex flex-col items-center justify-center p-8 gap-4 bg-gray-50">
          <div
            className={`relative w-[350px] h-[350px] md:w-[600px] md:h-[600px] transition-all duration-1000 ease-in-out transform 
                ${showWinningItem ? "scale-0 opacity-0 rotate-180" : "scale-100 opacaty-100"}`}
          >
            {/* Red pointer */}
            <div
              className={`
                absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 w-0 h-0
                border-t-[20px] border-t-transparent
                border-r-[40px] border-r-red-600
                border-b-[20px] border-b-transparent
                z-20
            `}
            />

            {/* Wheel Image */}
            <div
              className={`
                absolute inset-0 rounded-full overflow-hidden border-8 border-gray-200 
                shadow-[0_0_20px_rgba(0,0,0,0.2)]
                ${!isSpinning && !hasSpun && "animate-[float_3s_ease-in-out_infinite]"}
            `}
            ></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WheelOfFortune;
