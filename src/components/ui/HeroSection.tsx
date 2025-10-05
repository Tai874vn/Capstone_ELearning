'use client';

import React from 'react';
import { Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] bg-black overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: `url('/hero.png')`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          {/* Left content - Play button */}
          <div className="flex-1 flex items-center justify-end pr-12">
            <div className="relative">
              {/* Animated pulse rings */}
              <div className="absolute inset-0 -inset-10">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-ping"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${2 + i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              {/* Play button */}
              <button className="relative group w-32 h-32 bg-transparent border-4 border-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-all duration-300 hover:scale-110 cursor-pointer">
                <Play className="w-12 h-12 text-yellow-400 group-hover:text-black ml-1" fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Right content - Text and buttons */}
          <div className="flex-1 text-left lg:pl-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-6 tracking-tight leading-snug">
              KHỞI ĐẦU
              <br />
              SỰ NGHIỆP
              <br />
              CỦA BẠN
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-8">
              Trở thành lập trình
              <br />
              chuyên nghiệp tại CyberSoft
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                Xem khóa học
              </button>
              <button className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer">
                Tư vấn học
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;