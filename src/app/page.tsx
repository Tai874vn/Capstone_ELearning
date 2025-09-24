'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  // Get 8 most recent courses (sorted by ngayTao)
  const recentCourses = courses
    .sort((a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime())
    .slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <HeroSection></HeroSection>

      {/* Recent Courses Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">
              Recent Courses
            </h3>
            <button
              onClick={() => router.push('/danhmuckhoahoc?manhom=GP01')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              View All Courses →
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Loading courses...</span>
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
                Try again
              </button>
            </div>
          )}

          {/* Recent Courses Grid */}
          {!loading && recentCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentCourses.map((course) => (
                <CourseCard
                  key={course.maKhoaHoc}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
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
              <h3 className="mt-4 text-lg font-medium text-foreground">No courses available</h3>
              <p className="mt-2 text-muted-foreground">
                Check back later for new courses
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}