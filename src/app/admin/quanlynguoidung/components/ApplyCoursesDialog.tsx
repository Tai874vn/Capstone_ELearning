"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserService } from "@/services/adminUserService";
import { adminCourseService } from "@/services/adminCourseService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { User, Course } from "@/types/Index";

interface ApplyCoursesDialogProps {
  user: User;
}

export default function ApplyCoursesDialog({ user }: ApplyCoursesDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch unenrolled courses
  const { data: unenrolledCourses, isLoading: loadingUnenrolled } = useQuery({
    queryKey: ["unenrolled-courses", user.taiKhoan],
    queryFn: () => adminUserService.getUnenrolledCourses(user.taiKhoan),
    enabled: isOpen,
  });

  // Fetch pending courses
  const { data: pendingCourses, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-courses", user.taiKhoan],
    queryFn: () => adminUserService.getPendingCourses(user.taiKhoan),
    enabled: isOpen,
  });

  // Fetch approved courses
  const { data: approvedCourses, isLoading: loadingApproved } = useQuery({
    queryKey: ["approved-courses", user.taiKhoan],
    queryFn: () => adminUserService.getApprovedCourses(user.taiKhoan),
    enabled: isOpen,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: (maKhoaHoc: string) =>
      adminCourseService.enrollStudent({ maKhoaHoc, taiKhoan: user.taiKhoan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unenrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
      queryClient.invalidateQueries({ queryKey: ["approved-courses"] });
      toast.success("Ghi danh thành công!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Ghi danh thất bại!");
    },
  });

  // Cancel enrollment mutation
  const cancelMutation = useMutation({
    mutationFn: (maKhoaHoc: string) =>
      adminCourseService.cancelEnrollment({ maKhoaHoc, taiKhoan: user.taiKhoan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unenrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["pending-courses"] });
      queryClient.invalidateQueries({ queryKey: ["approved-courses"] });
      toast.success("Hủy ghi danh thành công!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Hủy ghi danh thất bại!");
    },
  });

  const filteredUnenrolled = unenrolledCourses?.filter((course) =>
    course.tenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-green-600 hover:bg-green-700 text-white border-green-600">
          Ghi danh
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn khóa học - {user.hoTen}</DialogTitle>
        </DialogHeader>
        <div className="sr-only" id="dialog-description">
          Quản lý ghi danh khóa học cho người dùng
        </div>

        {/* Search */}
        <Input
          placeholder="Nhập tên khóa học hoặc học viên"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        />

        {/* Unenrolled Courses */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-900">
            Khóa học chưa ghi danh 
          </h3>
          {loadingUnenrolled ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : filteredUnenrolled && filteredUnenrolled.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">STT</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Tên khóa học</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Chờ xác nhận</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredUnenrolled.slice(0, 5).map((course, index) => (
                    <tr key={course.maKhoaHoc} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-gray-900">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-900">{course.tenKhoaHoc}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => enrollMutation.mutate(course.maKhoaHoc)}
                          disabled={enrollMutation.isPending}
                        >
                          Xác thực
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Không có khóa học chưa ghi danh</p>
          )}
        </div>

        {/* Approved Courses */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-gray-900">
            Khóa học đã tham gia
          </h3>
          {loadingApproved ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : approvedCourses && approvedCourses.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">STT</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Tên khóa học</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-medium">Đã xác nhận</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {approvedCourses.slice(0, 5).map((course, index) => (
                    <tr key={course.maKhoaHoc} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-gray-900">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-900">{course.tenKhoaHoc}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => cancelMutation.mutate(course.maKhoaHoc)}
                          disabled={cancelMutation.isPending}
                        >
                          Hủy
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa tham gia khóa học nào</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
