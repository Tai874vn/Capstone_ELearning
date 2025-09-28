import { z } from 'zod'

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
      .max(20, { message: 'Tên đăng nhập phải ít hơn 20 ký tự' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
      }),
    name: z
      .string()
      .min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
      .max(50, { message: 'Họ tên phải ít hơn 50 ký tự' }),
    email: z
      .string()
      .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ' }),
    phone: z
      .string()
      .min(10, { message: 'Số điện thoại phải có ít nhất 10 chữ số' })
      .regex(/^\+\d{1,4}\d{7,14}$/, {
        message: 'Vui lòng nhập số điện thoại hợp lệ với mã quốc gia'
      }),
    password: z
      .string()
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Mật khẩu phải chứa ít nhất một chữ thường, một chữ hoa và một số'
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật Khẩu Không Khớp!',
    path: ['confirmPassword'],
  })

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Tên Tài Khoản Không Được Để Trống!' }),
  password: z
    .string()
    .min(1, { message: 'Mật Khẩu Không Được Để Trống!' }),
})

export type RegisterFormData = z.infer<typeof registerFormSchema>
export type LoginFormData = z.infer<typeof loginFormSchema>