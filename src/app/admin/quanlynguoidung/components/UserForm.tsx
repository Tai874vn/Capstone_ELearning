"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserService } from "@/services/adminUserService";
import { adminUserSchema, type AdminUserFormData } from "@/lib/validation-schemas";
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
import type { User } from "@/types/Index";

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
}

export default function UserForm({ user, onSuccess }: UserFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!user;

  // Fetch user types
  const { data: userTypes } = useQuery({
    queryKey: ["user-types"],
    queryFn: () => adminUserService.getUserTypes(),
  });

  const form = useForm<AdminUserFormData>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      taiKhoan: user?.taiKhoan || "",
      matKhau: "",
      hoTen: user?.hoTen || "",
      email: user?.email || "",
      soDT: user?.soDT || "",
      maLoaiNguoiDung: user?.maLoaiNguoiDung || "",
      maNhom: "GP01",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: AdminUserFormData) => adminUserService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Thêm người dùng thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thêm người dùng thất bại!");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: AdminUserFormData) => adminUserService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Cập nhật người dùng thành công!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Cập nhật người dùng thất bại!");
    },
  });

  const onSubmit = (data: AdminUserFormData) => {
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
            name="taiKhoan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập tài khoản"
                    disabled={isEditMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Nhập email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="matKhau"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder={isEditMode ? "Nhập mật khẩu mới" : "Nhập mật khẩu"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soDT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập số điện thoại" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hoTen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ tên</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nhập họ tên" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maLoaiNguoiDung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại người dùng</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại người dùng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userTypes?.map((type) => (
                    <SelectItem key={type.maLoaiNguoiDung} value={type.maLoaiNguoiDung}>
                      {type.tenLoaiNguoiDung}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
