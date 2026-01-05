"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/sanity.types";

const COLORS = [
  ["#dc2626", "#ef4444"], // red gradient (deeper)
  ["#ea580c", "#f97316"], // orange gradient (deeper)
  ["#eab308", "#facc15"], // yellow gradient (deeper)
  ["#65a30d", "#84cc16"], // lime gradient (deeper)
  ["#059669", "#10b981"], // emerald gradient (deeper)
  ["#0891b2", "#06b6d4"], // cyan gradient (deeper)
  ["#2563eb", "#3b82f6"], // blue gradient (deeper)
  ["#4f46e5", "#6366f1"], // indigo gradient (deeper)
  ["#9333ea", "#a855f7"], // purple gradient (deeper)
  ["#db2777", "#ec4899"], // pink gradient (deeper)
] as const;

const getSliceStyle = (length: number, index: number): React.CSSProperties => {
  const degrees = 360 / length;
  const rotate = degrees * index;

  const angle = (2 * Math.PI) / length;
  const r = 100;
  const startAngle = -angle / 2;
  const endAngle = angle / 2;

  const numPoints = 20;
  const points = [];

  points.push("50% 50%"); // Center point

  for (let i = 0; i <= numPoints; i++) {
    const currentAngle = startAngle + (endAngle - startAngle) * (i / numPoints);
    const x = 50 + r * Math.cos(currentAngle);
    const y = 50 + r * Math.sin(currentAngle);
    points.push(`${x}% ${y}%`);
  }

  const [colorStart, colorEnd] = COLORS[index % COLORS.length];

  return {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    transformOrigin: "50% 50%",
    transform: `rotate(${rotate}deg)`,
    background: `linear-gradient(115deg, ${colorStart} 0%, ${colorEnd} 100%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.2) 100%)`,
    backgroundBlendMode: "overlay",
    clipPath: `polygon(${points.join(", ")})`,
  };
};

const getTextStyle = () => {
  return {};
};

const PriceTag = ({ price }: { price: number }) => {
  return (
    <div className="flex items-center">
      <span className="text-white text-base font-extrabold drop-shadow-lg [text-shadow:_-2px_-2px_0_#22c55e,_2px_-2px_0_#22c55e,-2px_2px_0_#22c55e,_2px_2px_0_#22c55e]">
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

type WheelOfFortuneProps = {
  products: Product[];
  winningIndex: number;
};
const WheelOfFortune = ({ products, winningIndex }: WheelOfFortuneProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showWinningItem, setShowWinningItem] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  const [wheelStyle, setWheelStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const hasPlayed = localStorage.getItem("has-played-wheel-of-fortune");
    if (!hasPlayed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              style={{
                ...wheelStyle,
                animation:
                  !isSpinning && !hasSpun
                    ? "spin 30s linear infinite"
                    : undefined,
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  style={getSliceStyle(products.length, index)}
                  className="absolute inset-0"
                >
                  <div style={getTextStyle()} className="truncate px-2">
                    <span className="truncate">{product.title}</span>

                    <PriceTag price={(product.price || 0) * 5} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WheelOfFortune;
