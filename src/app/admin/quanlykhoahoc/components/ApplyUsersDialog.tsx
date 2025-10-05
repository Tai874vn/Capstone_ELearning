"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { Course } from "@/types/Index";

interface ApplyUsersDialogProps {
  course: Course;
}

export default function ApplyUsersDialog({ course }: ApplyUsersDialogProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch unenrolled students
  const { data: unenrolledStudents, isLoading: loadingUnenrolled } = useQuery({
    queryKey: ["unenrolled-students", course.maKhoaHoc],
    queryFn: () => adminCourseService.getUnenrolledStudents(course.maKhoaHoc),
    enabled: isOpen,
  });

  // Fetch pending students
  const { data: pendingStudents, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-students", course.maKhoaHoc],
    queryFn: () => adminCourseService.getPendingStudents(course.maKhoaHoc),
    enabled: isOpen,
  });

  // Fetch approved students
  const { data: approvedStudents, isLoading: loadingApproved } = useQuery({
    queryKey: ["approved-students", course.maKhoaHoc],
    queryFn: () => adminCourseService.getApprovedStudents(course.maKhoaHoc),
    enabled: isOpen,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: (taiKhoan: string) =>
      adminCourseService.enrollStudent({ maKhoaHoc: course.maKhoaHoc, taiKhoan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unenrolled-students"] });
      queryClient.invalidateQueries({ queryKey: ["pending-students"] });
      queryClient.invalidateQueries({ queryKey: ["approved-students"] });
      toast.success("Ghi danh thành công!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Ghi danh thất bại!");
    },
  });

  // Cancel enrollment mutation
  const cancelMutation = useMutation({
    mutationFn: (taiKhoan: string) =>
      adminCourseService.cancelEnrollment({ maKhoaHoc: course.maKhoaHoc, taiKhoan }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unenrolled-students"] });
      queryClient.invalidateQueries({ queryKey: ["pending-students"] });
      queryClient.invalidateQueries({ queryKey: ["approved-students"] });
      toast.success("Hủy ghi danh thành công!");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Hủy ghi danh thất bại!");
    },
  });

  const filteredUnenrolled = unenrolledStudents?.filter((student) =>
    student.hoTen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ghi danh
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn người dùng - {course.tenKhoaHoc}</DialogTitle>
        </DialogHeader>
        <div className="sr-only" id="dialog-description">
          Quản lý ghi danh học viên vào khóa học
        </div>

        {/* Search */}
        <Input
          placeholder="Tên người dùng (Có thể search)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Unenrolled Students */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">
            Học viên chờ xác thực
          </h3>
          {loadingUnenrolled ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : filteredUnenrolled && filteredUnenrolled.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">STT</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Tài khoản</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Họ tên</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Chờ xác nhận</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {filteredUnenrolled.slice(0, 5).map((student, index) => (
                    <tr key={student.taiKhoan} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.taiKhoan}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.hoTen}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => enrollMutation.mutate(student.taiKhoan)}
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
            <p className="text-sm text-gray-500">Không có học viên chờ xác thực</p>
          )}
        </div>

        {/* Approved Students */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">
            Học viên đã tham gia khóa học (Nếu không có thì không hiển thị)
          </h3>
          {loadingApproved ? (
            <p className="text-sm text-gray-500">Đang tải...</p>
          ) : approvedStudents && approvedStudents.length > 0 ? (
            <div className="border rounded-lg overflow-hidden border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">STT</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Tài khoản</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Họ tên</th>
                    <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Chờ xác nhận</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {approvedStudents.slice(0, 5).map((student, index) => (
                    <tr key={student.taiKhoan} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{index + 1}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.taiKhoan}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{student.hoTen}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => cancelMutation.mutate(student.taiKhoan)}
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
            <p className="text-sm text-gray-500">Chưa có học viên tham gia</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
