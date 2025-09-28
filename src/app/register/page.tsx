'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { BackToHome } from '@/components/ui/BackToHome'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'

import { registerFormSchema } from '@/lib/validation-schemas'

const formSchema = registerFormSchema

export default function RegisterPreview() {
  const router = useRouter()
  const { register, loading, error } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const registrationData = {
        taiKhoan: values.username,
        matKhau: values.password,
        hoTen: values.name,
        soDT: values.phone,
        email: values.email,
        maNhom: 'GP01'
      }

      await register(registrationData)

      toast.success('Đăng Ký Thành Công!.')
      router.push('/login')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Đăng Ký Thất Bại.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Image */}
      <div className="hidden lg:flex items-center justify-center bg-muted p-8">
        <img
          src="/login.png"
          alt="Register"
          className="w-3/4 h-3/4 object-cover rounded-2xl shadow-lg"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center p-8">
        <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-card-foreground text-xl">Đăng Ký</CardTitle>
          <CardDescription className="text-muted-foreground">
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username" className="text-card-foreground font-medium">Tên Tài Khoản</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="NguyenVanA123"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name" className="text-card-foreground font-medium">Họ Tên</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Nguyễn Văn A"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email" className="text-card-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="NguyenVanA@example.com"
                          type="email"
                          autoComplete="email"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone" className="text-card-foreground font-medium">Số Điện Thoại</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="TR" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password" className="text-card-foreground font-medium">Mật Khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder=""
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword" className="text-card-foreground font-medium">
                        Xác Nhận Mật Khẩu
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder=""
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2 pt-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-medium bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={form.handleSubmit(onSubmit)}
          >
            {loading ? 'Đang Đăng Ký...' : 'Đăng Ký'}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Đã Có Tài Khoản?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline-offset-4 hover:underline">
              Đăng Nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  )
}
