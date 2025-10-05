'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/themecontext';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { BackToHome } from '@/components/ui/BackToHome';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CalendarDays,
  Users,
  Eye,
  Star,
  Clock,
  BookOpen,
  User,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const { courseDetail, loading, error, fetchCourseDetail, clearCourseDetail } = useCourseStore();
  const { user, isAuthenticated } = useAuthStore();
  const { theme } = useTheme();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail(courseId);
    }

    return () => {
      clearCourseDetail();
    };
  }, [courseId, fetchCourseDetail, clearCourseDetail]);

  useEffect(() => {
    // Check if user is enrolled in this course
    const checkEnrollment = async () => {
      if (isAuthenticated && user && courseDetail) {
        try {
          const enrolledCourses = await courseService.getEnrolledCourses(user.taiKhoan);
          setIsEnrolled(enrolledCourses.some(course => course.maKhoaHoc === courseId));
        } catch (error) {
          console.error('Failed to check enrollment:', error);
        }
      }
    };

    checkEnrollment();
  }, [isAuthenticated, user, courseDetail, courseId]);

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in courses');
      router.push('/login');
      return;
    }

    if (!user || !courseDetail) return;

    setEnrollmentLoading(true);
    try {
      const enrollmentData = {
        maKhoaHoc: courseDetail.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      };

      if (isEnrolled) {
        await courseService.unenrollCourse(enrollmentData);
        setIsEnrolled(false);
        toast.success('Successfully unenrolled from course');
      } else {
        await courseService.enrollCourse(enrollmentData);
        setIsEnrolled(true);
        toast.success('Successfully enrolled in course');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message ||
        (isEnrolled ? 'Failed to unenroll from course' : 'Failed to enroll in course');
      toast.error(message);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading course details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3
            className="mt-4 text-lg font-medium"
            style={{
              color: mounted ? (theme === 'dark' ? 'white' : '#1f2937') : '#1f2937',
            }}
          >
            Course not found
          </h3>
          <p
            className="mt-2"
            style={{
              color: mounted ? (theme === 'dark' ? '#9ca3af' : '#6b7280') : '#6b7280',
            }}
          >
            {error || 'The course you are looking for does not exist.'}
          </p>
          <BackToHome className="mt-4" />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div>
          {/* Course Header */}
          <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Image */}
              <div className="lg:w-2/5 relative">
                <img
                  src={courseDetail.hinhAnh}
                  alt={courseDetail.tenKhoaHoc}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {courseDetail.danhMucKhoaHoc.tenDanhMucKhoaHoc}
                  </Badge>
                </div>
              </div>

              {/* Right: Content */}
              <div className="lg:w-3/5 p-6 lg:p-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {courseDetail.tenKhoaHoc}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>By {courseDetail.nguoiTao.hoTen}</span>
                  </div>
                  {/* <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Created {formatDate(courseDetail.ngayTao)}</span>
                  </div> */}
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{courseDetail.luotXem?.toLocaleString() || 0} views</span>
                  </div>
                  {/* <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{courseDetail.soLuongHocVien || 0} students</span>
                  </div> */}
                  {courseDetail.danhGia && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900">{courseDetail.danhGia}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {courseDetail.moTa}
                </p>
              </div>
            </div>
          </div>

          {/* Enrollment Button */}
          <div className="mb-8 flex justify-center">
            <Button
              onClick={handleEnrollment}
              disabled={enrollmentLoading}
              className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
                isEnrolled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {enrollmentLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isEnrolled ? 'Đang hủy đăng ký...' : 'Đang đăng ký...'}
                </div>
              ) : (
                <>
                  {isEnrolled ? (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      Hủy Đăng Ký
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Đăng Ký Khóa Học
                    </>
                  )}
                </>
              )}
            </Button>
          </div>


          {/* Students Section - Disabled */}
          {/* {courseDetail.thongTinHocVien && courseDetail.thongTinHocVien.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Students ({courseDetail.thongTinHocVien.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {courseDetail.thongTinHocVien.slice(0, 12).map((student) => (
                    <div
                      key={student.taiKhoan}
                      className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={student.hinhAnh || '/api/placeholder/32/32'}
                          alt={student.hoTen}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.hoTen)}&background=3b82f6&color=fff`;
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {student.hoTen}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{student.taiKhoan}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {courseDetail.thongTinHocVien.length > 12 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    And {courseDetail.thongTinHocVien.length - 12} more students...
                  </p>
                )}
              </CardContent>
            </Card>
          )} */}
        </div>
      </div>
    </div>
  );
}