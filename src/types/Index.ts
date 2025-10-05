// Base API Response
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
}

// User Types
export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
}

export interface UserLogin {
  taiKhoan: string;
  matKhau: string;
}

export interface UserRegister {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maNhom: string;
  email: string;
}

export interface UpdateUserRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  email: string;
}

export interface CreateUserRequest {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  email: string;
}

export interface UserListResponse {
  currentPage: number;
  count: number;
  totalPage: number;
  totalCount: number;
  items: User[];
}

export interface UserType {
  maLoaiNguoiDung: string;
  tenLoaiNguoiDung: string;
}

export interface AuthUser {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  accessToken: string;
}

// Course Types
export interface Course {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
  danhMucKhoaHoc: {
    maDanhMucKhoaHoc: string;
    tenDanhMucKhoaHoc: string;
  };
  nguoiTao: {
    taiKhoan: string;
    hoTen: string;
  };
  soLuongHocVien?: number;
}

export interface CourseDetail extends Course {
  soLuongHocVien: number;
  thongTinHocVien?: StudentInfo[];
}

export interface CreateCourseRequest {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
}

export interface UpdateCourseRequest {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
}

export interface CourseListResponse {
  currentPage: number;
  count: number;
  totalPage: number;
  totalCount: number;
  items: Course[];
}

export interface EnrollmentRequest {
  maKhoaHoc: string;
  taiKhoan: string;
}

export interface PendingStudent {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
}

export interface ApprovedStudent {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
}

export interface StudentInfo {
  taiKhoan: string;
  hoTen: string;
  biDanh: string;
  hinhAnh: string;
}

export interface CourseCategory {
  maDanhMuc: string;
  tenDanhMuc: string;
}

// Enrollment Types
export interface EnrollmentInfo {
  maKhoaHoc: string;
  taiKhoan: string;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  isLoading: boolean;
}

// Store Types
export interface CourseState {
  courses: Course[];
  courseDetail: CourseDetail | null;
  categories: CourseCategory[];
  featuredCourses: Course[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  totalPages: number;

  // Actions
  fetchCourses: () => Promise<void>;
  fetchCoursesByGroup: (groupCode: string, page?: number, pageSize?: number) => Promise<void>;
  fetchCourseDetail: (courseCode: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCoursesByCategory: (categoryCode: string, groupCode?: string, page?: number, pageSize?: number) => Promise<void>;
  searchCourses: (keyword: string, groupCode?: string, page?: number, pageSize?: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCourseDetail: () => void;
  setPage: (page: number) => void;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
  updateUserInfo: (userData: Partial<AuthUser>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Utility Types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  keyword?: string;
  categoryId?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Navigation Types
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}