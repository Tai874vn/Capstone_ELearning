import React from 'react';
import Image from 'next/image';
import type { Course } from '../../types/Index';
import { Star, Eye } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick?: (courseId: string) => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {

  return (
    <div
      className="border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer backdrop-blur-sm bg-white"
      onClick={() => onClick?.(course.maKhoaHoc)}
    >
      <div className="relative h-48">
        <Image
          src={course.hinhAnh}
          alt={course.tenKhoaHoc}
          fill
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || 'Chưa phân loại'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.tenKhoaHoc}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.moTa}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>By {course.nguoiTao?.hoTen || 'Unknown'}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{course.luotXem?.toLocaleString() || 0}</span>
            </div>
            {course.danhGia && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                <span className="font-medium text-gray-900">{course.danhGia}</span>
              </div>
            )}
          </div>
        </div>

        {/* <div className="flex items-center justify-end">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {course.soLuongHocVien} students
          </span>
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            View Course
          </button>
        </div> */}
      </div>
    </div>
  );
}