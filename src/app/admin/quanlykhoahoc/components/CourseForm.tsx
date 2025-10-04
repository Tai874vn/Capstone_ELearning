"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCourseService } from "@/services/adminCourseService";
import { useAuthStore } from "@/store/authStore";
import { adminCourseSchema, type AdminCourseFormData } from "@/lib/validation-schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Course } from "@/types/Index";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CKEditor = dynamic(() => import("@/components/ui/ckeditor"), {
  ssr: false,
});

interface CourseFormProps {
  course?: Course;
  onSuccess: () => void;
}

export default function CourseForm({ course, onSuccess }: CourseFormProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isEditMode = !!course;
  const [editorContent, setEditorContent] = useState(course?.moTa || "");

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["course-categories"],
    queryFn: () => adminCourseService.getCategories(),
  });

  const form = useForm<AdminCourseFormData>({
    resolver: zodResolver(adminCourseSchema),
    defaultValues: {
      maKhoaHoc: course?.maKhoaHoc || "",
      biDanh: course?.biDanh || "",
      tenKhoaHoc: course?.tenKhoaHoc || "",
      moTa: course?.moTa || "",
      luotXem: course?.luotXem || 0,
      danhGia: course?.danhGia || 0,
      hinhAnh: course?.hinhAnh || "",
      maNhom: "GP01",
      ngayTao: course?.ngayTao || new Date().toLocaleDateString("en-GB"),
      maDanhMucKhoaHoc: course?.maDanhMucKhoaHoc || "",
      taiKhoanNguoiTao: user?.taiKhoan || "",
    },
  });

  useEffect(() => {
    form.setValue("moTa", editorContent);
  }, [editorContent, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: AdminCourseFormData) => adminCourseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Thêm khóa học thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thêm khóa học thất bại!");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: AdminCourseFormData) => adminCourseService.updateCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast.success("Cập nhật khóa học thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật khóa học thất bại!");
    },
  });

  const onSubmit = (data: AdminCourseFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maKhoaHoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã khóa học</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập mã khóa học"
                    disabled={isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="danhGia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đánh giá</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0-5"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tenKhoaHoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khóa học</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập tên khóa học" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="luotXem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lượt xem</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maDanhMucKhoaHoc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh mục khóa học</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.maDanhMuc} value={category.maDanhMuc}>
                        {category.tenDanhMuc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taiKhoanNguoiTao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người tạo</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ngayTao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày tạo (dd/MM/yyyy)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="dd/MM/yyyy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hinhAnh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh (URL)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/image.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moTa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <div className="border rounded-md">
                  <CKEditor
                    value={editorContent}
                    onChange={(data: string) => setEditorContent(data)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            onClick={onSuccess}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditMode ? "Lưu" : "Thêm"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
