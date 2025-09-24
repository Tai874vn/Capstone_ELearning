import React from 'react';
import { Course } from '../../store/courseStore';
import { useTheme } from '../../context/themecontext';

interface CourseCardProps {
  course: Course;
  onClick?: (courseId: string) => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const { theme } = useTheme();

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer backdrop-blur-sm"
      style={{
        transition: 'all 0.3s ease',
        backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgba(255, 255, 255, 0.95)'
      }}
      onClick={() => onClick?.(course.maKhoaHoc)}
    >
      <div className="relative">
        <img
          src={course.hinhAnh}
          alt={course.tenKhoaHoc}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {course.danhMucKhoaHoc.tenDanhMucKhoaHoc}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-card-foreground mb-2 line-clamp-2">
          {course.tenKhoaHoc}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3">
          {course.moTa}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>By {course.nguoiTao.hoTen}</span>
          <span>{course.luotXem} views</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {course.soLuongHocVien} students
          </span>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
}