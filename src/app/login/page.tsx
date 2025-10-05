'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { loginFormSchema, type LoginFormData } from "@/lib/validation-schemas";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      // Convert email to account format for API
      await login({
        taiKhoan: data.username, // API expects taiKhoan field
        matKhau: data.password,
      });
      toast.success('Login successful!');
      router.push('/');
    } catch {
      // Error is already handled in the store
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:flex items-center justify-center bg-muted p-8">
        <Image
          src="/login.png"
          alt="Login"
          width={600}
          height={600}
          className="object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground text-xl">Đăng Nhập</CardTitle>
          <CardDescription>
          </CardDescription>
          <CardAction>
            <Link href="/register">
              <Button variant="link" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer">
                Đăng ký
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-card-foreground font-medium">
                  Tên Đăng Nhập
                </Label>
                <Input
                  id="email"
                  {...register('username')}
                  type="text"
                  placeholder=""
                />
                {errors.username && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-card-foreground font-medium">
                    Mật Khẩu
                  </Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline-offset-4 hover:underline"
                  >
                    Quên Mật Khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang Đăng Nhập...
                </div>
              ) : (
                'Đăng Nhập'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}