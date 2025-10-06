'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCourseStore } from '../../store/courseStore';
import { CourseCard } from '../../components/ui/CourseCard';
import { CoursePagination } from '../../components/ui/CoursePagination';
import { SearchBar } from '../../components/ui/SearchBar';

function DanhMucKhoaHocContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    courses,
    categories,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    fetchCategories,
    searchCourses,
    fetchCoursesByCategory,
    fetchCoursesByGroup,
    setPage
  } = useCourseStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('GP01');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const COURSES_PER_PAGE = 12;

  // Get query parameters
  const madanhmuc = searchParams.get('madanhmuc') || 'all';
  const manhom = searchParams.get('manhom') || 'GP01';

  useEffect(() => {
    fetchCategories();

    // Set initial state from URL parameters
    setSelectedCategory(madanhmuc);
    setSelectedGroup(manhom);

    // Fetch courses based on URL parameters on initial load
    if (madanhmuc === 'all') {
      fetchCoursesByGroup(manhom, 1, COURSES_PER_PAGE);
    } else {
      fetchCoursesByCategory(madanhmuc, manhom, 1, COURSES_PER_PAGE);
    }
  }, [fetchCategories, fetchCoursesByGroup, fetchCoursesByCategory, madanhmuc, manhom]);

  // Update URL when filters change
  const updateURL = (newCategory: string, newGroup: string) => {
    const params = new URLSearchParams();
    if (newCategory !== 'all') {
      params.set('madanhmuc', newCategory);
    }
    params.set('manhom', newGroup);

    const newURL = `/danhmuckhoahoc${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newURL, { scroll: false });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
    if (query.trim()) {
      await searchCourses(query, selectedGroup, 1, COURSES_PER_PAGE);
      setSelectedCategory('all');
      updateURL('all', selectedGroup);
    } else {
      await fetchCoursesByGroup(selectedGroup, 1, COURSES_PER_PAGE);
    }
  };

  const handleCategorySelect = async (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setSearchQuery('');
    setPage(1);
    updateURL(categoryCode, selectedGroup);

    if (categoryCode === 'all') {
      await fetchCoursesByGroup(selectedGroup, 1, COURSES_PER_PAGE);
    } else {
      await fetchCoursesByCategory(categoryCode, selectedGroup, 1, COURSES_PER_PAGE);
    }
  };

  const handleGroupSelect = async (groupCode: string) => {
    setSelectedGroup(groupCode);
    setSearchQuery('');
    setPage(1);
    updateURL(selectedCategory, groupCode);

    // Fetch courses by the new group
    await fetchCoursesByGroup(groupCode, 1, COURSES_PER_PAGE);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handlePageChange = async (page: number) => {
    setPage(page);

    // Fetch data for the new page
    if (searchQuery) {
      await searchCourses(searchQuery, selectedGroup, page, COURSES_PER_PAGE);
    } else if (selectedCategory === 'all') {
      await fetchCoursesByGroup(selectedGroup, page, COURSES_PER_PAGE);
    } else {
      await fetchCoursesByCategory(selectedCategory, selectedGroup, page, COURSES_PER_PAGE);
    }

    document.getElementById('courses-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
    }
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className="text-center"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Danh Mục Khóa Học
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tìm kiếm hàng nghìn khóa học và tìm lộ trình học tập hoàn hảo cho bạn
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm khóa học, chủ đề hoặc giảng viên..."
                className="mb-4"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Group Filter */}
        <motion.div
          className="mb-6"
          variants={filterVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-bold text-foreground mb-3">
            Chọn Nhóm
          </h2>
          <div className="flex flex-wrap gap-2">
            {['GP01', 'GP02', 'GP03', 'GP04', 'GP05'].map((group) => (
              <button
                key={group}
                onClick={() => handleGroupSelect(group)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGroup === group
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-8"
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Duyệt Theo Danh Mục
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-card border border-border text-card-foreground hover:bg-muted'
              }`}
            >
              Tất Cả Khóa Học ({totalCount})
            </button>
            {categories.map((category) => (
              <button
                key={category.maDanhMuc}
                onClick={() => handleCategorySelect(category.maDanhMuc)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.maDanhMuc
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-card border border-border text-card-foreground hover:bg-muted'
                }`}
              >
                {category.tenDanhMuc}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Featured Courses Carousel - Disabled */}
        {/* {!searchQuery && selectedCategory === 'all' && featuredCourses.length > 0 && (
          <section className="mb-12">
            <CourseCarousel
              courses={featuredCourses}
              onCourseClick={handleCourseClick}
              title="Khóa Học Nổi Bật"
            />
          </section>
        )} */}

        {/* Current Filters Display */}
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">Bộ lọc hiện tại:</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              Nhóm: {selectedGroup}
            </span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                Danh mục: {categories.find(c => c.maDanhMuc === selectedCategory)?.tenDanhMuc || selectedCategory}
              </span>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <section id="courses-section">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` :
               selectedCategory === 'all' ? 'Tất Cả Khóa Học' :
               categories.find(c => c.maDanhMuc === selectedCategory)?.tenDanhMuc || 'Khóa Học'}
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                {totalCount} khóa học
              </span>
              {totalPages > 1 && (
                <span className="text-muted-foreground text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Đang tải khóa học...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => fetchCoursesByGroup(selectedGroup, 1, COURSES_PER_PAGE)}
                className="mt-2 text-destructive hover:text-destructive/80 font-medium"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && courses.length > 0 && (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={currentPage}
              >
                {courses.map((course) => (
                  <motion.div key={course.maKhoaHoc} variants={itemVariants}>
                    <CourseCard
                      course={course}
                      onClick={handleCourseClick}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <CoursePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && courses.length === 0 && !error && (
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
              <h3 className="mt-4 text-lg font-medium text-foreground">Không tìm thấy khóa học</h3>
              <p className="mt-2 text-muted-foreground">
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Thử chọn danh mục khác'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    fetchCoursesByGroup(selectedGroup, 1, COURSES_PER_PAGE);
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Xóa tìm kiếm và hiển thị tất cả khóa học
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function DanhMucKhoaHocPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <DanhMucKhoaHocContent />
    </Suspense>
  );
}