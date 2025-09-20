'use client';

import React, { useEffect, useState } from 'react';
import { useCourseStore } from '../store/courseStore';
import { useTheme } from '../context/themecontext';
import { CourseCard } from '../components/ui/CourseCard';
import { SearchBar } from '../components/ui/SearchBar';

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const {
    courses,
    categories,
    featuredCourses,
    loading,
    error,
    fetchCourses,
    fetchCategories,
    searchCourses,
    fetchCoursesByCategory
  } = useCourseStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchCourses(query);
      setSelectedCategory('all');
    } else {
      await fetchCourses();
    }
  };

  const handleCategorySelect = async (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setSearchQuery('');
    if (categoryCode === 'all') {
      await fetchCourses();
    } else {
      await fetchCoursesByCategory(categoryCode);
    }
  };

  const handleCourseClick = (courseId: string) => {
    // Navigate to course detail page
    console.log('Navigate to course:', courseId);
  };

  const displayCourses = searchQuery ? courses : (selectedCategory === 'all' ? courses : courses);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header Section */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ELearning Platform
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Learn Without Limits
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover thousands of courses from expert instructors and advance your skills at your own pace
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="What do you want to learn today?"
              className="mb-4"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
              }`}
            >
              All Courses
            </button>
            {categories.map((category) => (
              <button
                key={category.maDanhMuc}
                onClick={() => handleCategorySelect(category.maDanhMuc)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.maDanhMuc
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {category.tenDanhMuc}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        {!searchQuery && selectedCategory === 'all' && featuredCourses.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Courses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.maKhoaHoc}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* Courses Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? `Search results for "${searchQuery}"` :
               selectedCategory === 'all' ? 'All Courses' :
               categories.find(c => c.maDanhMuc === selectedCategory)?.tenDanhMuc || 'Courses'}
            </h3>
            <span className="text-gray-600 dark:text-gray-400">
              {displayCourses.length} courses found
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading courses...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={() => fetchCourses()}
                className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && displayCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayCourses.map((course) => (
                <CourseCard
                  key={course.maKhoaHoc}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && displayCourses.length === 0 && !error && (
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
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {searchQuery ? 'Try searching for something else' : 'Try selecting a different category'}
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ELearning Platform</h3>
            <p className="text-gray-400 mb-4">
              Empowering learners worldwide with quality education
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Courses
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Support
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                © 2024 ELearning Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}