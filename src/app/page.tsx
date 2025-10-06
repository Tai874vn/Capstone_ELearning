'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCourseStore } from '../store/courseStore';
import { CourseCard } from '../components/ui/CourseCard';
import  HeroSection  from '../components/ui/HeroSection'
export default function HomePage() {
  const router = useRouter();
  const {
    courses,
    loading,
    error,
    fetchCourses
  } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const recentCourses = courses
    .sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime())
    .slice(0, 8);

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection></HeroSection>

      {/* Recent Courses Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3 className="text-3xl font-bold text-foreground">
              Khóa Học Mới Cập Nhập
            </h3>
            <button
              onClick={() => router.push('/danhmuckhoahoc?manhom=GP01')}
              className="text-foreground font-medium cursor-pointer"
            >
              Tất Cả Khóa Học →
            </button>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Đang Tải Khóa Học...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => fetchCourses()}
                className="mt-2 text-destructive hover:text-destructive/80 font-medium"
              >
                Thử Lại
              </button>
            </div>
          )}

          {/* Recent Courses Grid */}
          {!loading && recentCourses.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recentCourses.map((course) => (
                <motion.div key={course.maKhoaHoc} variants={itemVariants}>
                  <CourseCard
                    course={course}
                    onClick={handleCourseClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && recentCourses.length === 0 && !error && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-foreground">Không Có Khóa Học Tồn Tại</h3>
            </div>
          )}
        </section>
      </main>
    </>
  );
}