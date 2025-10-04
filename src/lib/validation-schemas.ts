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

// Admin User Management Schemas
export const adminUserSchema = z.object({
  taiKhoan: z
    .string()
    .min(3, { message: 'Tài khoản phải có ít nhất 3 ký tự' })
    .max(20, { message: 'Tài khoản không được quá 20 ký tự' }),
  matKhau: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
  hoTen: z
    .string()
    .min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Họ tên không được quá 50 ký tự' }),
  email: z
    .string()
    .email({ message: 'Email không hợp lệ' }),
  soDT: z
    .string()
    .min(10, { message: 'Số điện thoại phải có ít nhất 10 số' })
    .max(11, { message: 'Số điện thoại không được quá 11 số' }),
  maLoaiNguoiDung: z
    .string()
    .min(1, { message: 'Vui lòng chọn loại người dùng' }),
  maNhom: z.string().default('GP01'),
});

// Admin Course Management Schemas
export const adminCourseSchema = z.object({
  maKhoaHoc: z
    .string()
    .min(3, { message: 'Mã khóa học phải có ít nhất 3 ký tự' })
    .max(20, { message: 'Mã khóa học không được quá 20 ký tự' }),
  tenKhoaHoc: z
    .string()
    .min(3, { message: 'Tên khóa học phải có ít nhất 3 ký tự' })
    .max(100, { message: 'Tên khóa học không được quá 100 ký tự' }),
  biDanh: z
    .string()
    .min(3, { message: 'Bí danh phải có ít nhất 3 ký tự' }),
  moTa: z
    .string()
    .min(10, { message: 'Mô tả phải có ít nhất 10 ký tự' }),
  luotXem: z
    .number()
    .min(0, { message: 'Lượt xem không được âm' })
    .default(0),
  danhGia: z
    .number()
    .min(0, { message: 'Đánh giá không được âm' })
    .max(5, { message: 'Đánh giá không được quá 5' })
    .default(0),
  hinhAnh: z
    .string()
    .min(1, { message: 'Vui lòng chọn hình ảnh' }),
  maNhom: z.string().default('GP01'),
  ngayTao: z.string(),
  maDanhMucKhoaHoc: z
    .string()
    .min(1, { message: 'Vui lòng chọn danh mục khóa học' }),
  taiKhoanNguoiTao: z.string(),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>
export type AdminCourseFormData = z.infer<typeof adminCourseSchema>