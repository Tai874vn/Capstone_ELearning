'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-card border-t border-black dark:border-white text-foreground py-12 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Section - Subscription Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              NHẬN TIN SỰ KIỆN & KHUYẾN MÃI
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Nhận thông tin về các khóa học miễn phí và chương trình khuyến mãi hấp dẫn từ CyberSoft
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="your.address@email.com"
                className="bg-white text-black placeholder-gray-500 border-none"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium cursor-pointer">
                ĐĂNG KÝ
              </Button>
            </div>
          </div>

          {/* Center Section - Consultation Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              ĐĂNG KÍ TƯ VẤN
            </h3>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Họ và tên *"
                className="bg-white text-black placeholder-gray-500 border-none"
              />
              <Input
                type="email"
                placeholder="Email liên hệ *"
                className="bg-white text-black placeholder-gray-500 border-none"
              />
              <Input
                type="tel"
                placeholder="Điện thoại liên hệ *"
                className="bg-white text-black placeholder-gray-500 border-none"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium cursor-pointer">
                ĐĂNG KÍ TƯ VẤN
              </Button>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex items-center justify-center">
            <Image
              src="/cybersoft.png"
              alt="CyberSoft Academy"
              width={300}
              height={300}
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Branch Addresses */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>ĐỊA CHỈ CÁC CƠ SỞ</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Cơ sở 1: 376 Võ Văn Tần – Quận 3</p>
                <p>Cơ sở 2: 459 Sư Vạn Hạnh – Quận 10</p>
                <p>Cơ sở 3: 82 Ung Văn Khiêm – Bình Thạnh</p>
                <p>Cơ sở 4: Đà Nẵng – Quận Hải Châu</p>
              </div>
            </div>

            {/* Hotlines */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>HOTLINE</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>096.105.1014</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>098.407.5835</p>
              </div>
            </div>

            {/* Course Categories */}
            <div className="lg:col-span-2">
              <h4 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>DANH MỤC KHÓA HỌC</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                {[
                  'Front End', 'ReactJS', 'Angular', 'NodeJS', 'Backend',
                  'Java Web', 'Java Spring', 'Online Coding Bootcamp',
                  'JavaScript', 'TypeScript', 'Python', 'Full Stack'
                ].map((course, index) => (
                  <span
                    key={index}
                    className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs hover:bg-muted/80 cursor-pointer transition-colors"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-border">
            <p className="text-muted-foreground text-sm">
              © 2025 CyberSoft Academy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}