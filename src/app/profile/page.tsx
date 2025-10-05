'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCard } from '@/components/ui/CourseCard';
import { Search, BookOpen, XCircle } from 'lucide-react';
import type { Course } from '@/types/Index';

// Validation schema for profile update
const profileUpdateSchema = z.object({
  taiKhoan: z.string().min(1, { message: 'Tài khoản không được để trống' }),
  matKhau: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
  confirmMatKhau: z.string().min(1, { message: 'Xác nhận mật khẩu không được để trống' }),
  hoTen: z.string().min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' }),
  soDT: z.string().min(10, { message: 'Số điện thoại phải có ít nhất 10 số' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  maLoaiNguoiDung: z.string(),
  maNhom: z.string(),
}).refine((data) => data.matKhau === data.confirmMatKhau, {
  message: 'Mật khẩu không khớp',
  path: ['confirmMatKhau'],
});

type ProfileFormData = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUserInfo } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(3);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    // Set hydrated to true after component mounts
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only check authentication after hydration is complete
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Load user info from localStorage and API
    loadUserInfo();
    loadEnrolledCourses();
  }, [isAuthenticated, router, isHydrated, loadUserInfo, loadEnrolledCourses]);

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm) {
      const filtered = enrolledCourses.filter(course =>
        course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.moTa.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(enrolledCourses);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, enrolledCourses]);

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const loadUserInfo = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Get user info from API or use stored user data
      const userData = user;

      // Populate form with user data
      reset({
        taiKhoan: userData.taiKhoan || '',
        matKhau: '', // Don't populate password for security
        hoTen: userData.hoTen || '',
        soDT: userData.soDT || '',
        email: userData.email || '',
        maLoaiNguoiDung: userData.maLoaiNguoiDung || 'HV',
        maNhom: userData.maNhom || 'GP01',
      });
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  }, [user, reset]);

  const loadEnrolledCourses = useCallback(async () => {
    if (!user) return;

    try {
      setCoursesLoading(true);
      const courses = await courseService.getEnrolledCourses(user.taiKhoan);
      setEnrolledCourses(courses);
      setFilteredCourses(courses);
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setCoursesLoading(false);
    }
  }, [user]);

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleUnenroll = async (courseCode: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) return;

    try {
      const enrollmentData = {
        maKhoaHoc: courseCode,
        taiKhoan: user.taiKhoan,
      };

      await courseService.unenrollCourse(enrollmentData);

      // Reload enrolled courses
      await loadEnrolledCourses();

      toast.success('Hủy đăng ký khóa học thành công!');
    } catch (error: unknown) {
      console.error('Error unenrolling from course:', error);
      toast.error((error as Error).message || 'Hủy đăng ký thất bại');
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);

      // Call API to update user information
      await userService.updateUserInfo(data);

      // Update user info in store
      updateUserInfo(data);

      toast.success('Cập nhật thông tin thành công!');
    } catch (error: unknown) {
      console.error('Error updating user info:', error);
      toast.error((error as Error).message || 'Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Thông Tin Cá Nhân</h1>
        <p className="text-muted-foreground mt-2">Quản lý thông tin cá nhân và khóa học của bạn</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Thông Tin Cá Nhân</TabsTrigger>
          <TabsTrigger value="courses">Khóa Học Của Tôi</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cập Nhật Thông Tin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="grid gap-2">
                    <Label htmlFor="taiKhoan" className="text-foreground font-medium">
                      Tài Khoản
                    </Label>
                    <Input
                      id="taiKhoan"
                      {...register('taiKhoan')}
                      type="text"
                      disabled // Username should not be editable
                      className="bg-muted"
                    />
                    {errors.taiKhoan && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.taiKhoan.message}
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="hoTen" className="text-foreground font-medium">
                      Họ Tên
                    </Label>
                    <Input
                      id="hoTen"
                      {...register('hoTen')}
                      type="text"
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.hoTen && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.hoTen.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      {...register('email')}
                      type="email"
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="grid gap-2">
                    <Label htmlFor="soDT" className="text-foreground font-medium">
                      Số Điện Thoại
                    </Label>
                    <Input
                      id="soDT"
                      {...register('soDT')}
                      type="tel"
                      placeholder="0123456789"
                    />
                    {errors.soDT && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.soDT.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="matKhau" className="text-foreground font-medium">
                      Mật Khẩu Mới
                    </Label>
                    <Input
                      id="matKhau"
                      {...register('matKhau')}
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                    />
                    {errors.matKhau && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.matKhau.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="grid gap-2">
                    <Label htmlFor="confirmMatKhau" className="text-foreground font-medium">
                      Xác Nhận Mật Khẩu
                    </Label>
                    <Input
                      id="confirmMatKhau"
                      {...register('confirmMatKhau')}
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                    />
                    {errors.confirmMatKhau && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                        {errors.confirmMatKhau.message}
                      </p>
                    )}
                  </div>

                  {/* User Type (Hidden/Disabled) */}
                  <input
                    type="hidden"
                    {...register('maLoaiNguoiDung')}
                    value="HV"
                  />
                  <input
                    type="hidden"
                    {...register('maNhom')}
                    value="GP01"
                  />
                </div>

                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang Cập Nhật...
                      </div>
                    ) : (
                      'Cập Nhật Thông Tin'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Khóa Học Của Tôi</CardTitle>
              <div className="flex items-center mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {coursesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-muted-foreground">Đang tải khóa học...</span>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">
                    {searchTerm ? 'Không tìm thấy khóa học nào' : 'Bạn chưa đăng ký khóa học nào'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCourses.map((course) => (
                      <div key={course.maKhoaHoc} className="relative">
                        <CourseCard
                          course={course}
                          onClick={handleCourseClick}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => handleUnenroll(course.maKhoaHoc, e)}
                          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 shadow-lg cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2"
                      >
                        Trước
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[2.5rem] cursor-pointer ${
                              currentPage === page
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : ''
                            }`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2"
                      >
                        Sau
                      </Button>
                    </div>
                  )}

                  {/* Course Count Info */}
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Hiển thị {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} trong tổng số {filteredCourses.length} khóa học
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}