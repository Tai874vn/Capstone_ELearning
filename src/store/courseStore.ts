import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';
import type { Course, CourseCategory, CourseState, CourseDetail } from '../types/Index';

export const useCourseStore = create<CourseState>()(
  devtools(
    (set, get) => ({
      courses: [],
      courseDetail: null,
      categories: [],
      featuredCourses: [],
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearCourseDetail: () => set({ courseDetail: null }),

      fetchCourses: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc');
          const courses = response.data;

          // Sort courses by views (luotXem) in descending order for featured courses
          const sortedByViews = [...courses].sort((a, b) => (b.luotXem || 0) - (a.luotXem || 0));

          set({
            courses,
            featuredCourses: sortedByViews.slice(0, 6), // Top 6 most viewed courses
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch courses',
            loading: false
          });
        }
      },

      fetchCourseDetail: async (courseCode: string) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseCode}`);
          set({ courseDetail: response.data, loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch course details',
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