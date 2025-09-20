import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

export interface Course {
  maKhoaHoc: string;
  tenKhoaHoc: string;
  moTa: string;
  hinhAnh: string;
  ngayTao: string;
  luotXem: number;
  soLuongHocVien: number;
  danhMucKhoaHoc: {
    maDanhMucKhoaHoc: string;
    tenDanhMucKhoaHoc: string;
  };
  nguoiTao: {
    taiKhoan: string;
    hoTen: string;
  };
}

export interface CourseCategory {
  maDanhMuc: string;
  tenDanhMuc: string;
}

interface CourseState {
  courses: Course[];
  categories: CourseCategory[];
  featuredCourses: Course[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCourses: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCoursesByCategory: (categoryCode: string) => Promise<void>;
  searchCourses: (keyword: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCourseStore = create<CourseState>()(
  devtools(
    (set, get) => ({
      courses: [],
      categories: [],
      featuredCourses: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      fetchCourses: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc');
          const courses = response.data;
          set({
            courses,
            featuredCourses: courses.slice(0, 6), // First 6 as featured
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch courses',
            loading: false
          });
        }
      },

      fetchCategories: async () => {
        try {
          const response = await api.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
          set({ categories: response.data });
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to fetch categories' });
        }
      },

      fetchCoursesByCategory: async (categoryCode: string) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${categoryCode}`);
          set({ courses: response.data, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch courses by category',
            loading: false
          });
        }
      },

      searchCourses: async (keyword: string) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${keyword}`);
          set({ courses: response.data, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to search courses',
            loading: false
          });
        }
      },
    }),
    { name: 'course-store' }
  )
);