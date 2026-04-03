"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const SalesCampaignBanner = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(86399); // 24 hours in seconds
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedEndTime = localStorage.getItem("flashSaleEndTime");

    if (savedEndTime) {
      const remaining = Math.floor(
        (parseInt(savedEndTime) - Date.now()) / 1000,
      );
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        localStorage.setItem(
          "flashSaleEndTime",
          (Date.now() + 86400000).toString(),
        );
        setTimeLeft(86399);
      }
    } else {
      localStorage.setItem(
        "flashSaleEndTime",
        (Date.now() + 86400000).toString(),
      );
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 86399 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 py-3 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold animate-bounce">
              🔥
            </span>
            <div className="text-sm sm:text-base font-bold">
              FLASH SALE ENDS IN:
            </div>
            <div className="bg-white text-lg rounded px-3 py-1 text-red-600 font-mono font-bold tabular-nums min-w-[120px] text-center shadow-inner">
              {mounted ? formatTime() : "23:59:59"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold animate-bounce">
              ⚡
            </span>
            <span className="font-bold text-yellow-200 animate-pulse">
              UP TO 90% OFF!
            </span>
          </div>

          {/* <button
            className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-200 transition-colors shadow-lg"
            onClick={() => {
              router.push("/");
            }}
          >
            SHOP NOW!
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SalesCampaignBanner;
