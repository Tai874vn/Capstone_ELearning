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
      currentPage: 1,
      totalCount: 0,
      totalPages: 0,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearCourseDetail: () => set({ courseDetail: null }),
      setPage: (page) => set({ currentPage: page }),

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

      fetchCoursesByCategory: async (categoryCode: string, groupCode: string = 'GP01', page: number = 1, pageSize: number = 12) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${categoryCode}&MaNhom=${groupCode}`);

          const courses = Array.isArray(response.data) ? response.data : [];

          // Client-side pagination for category filtering since API doesn't support pagination for this endpoint
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedCourses = courses.slice(startIndex, endIndex);
          const totalCount = courses.length;
          const totalPages = Math.ceil(totalCount / pageSize);

          set({
            courses: paginatedCourses,
            currentPage: page,
            totalCount,
            totalPages,
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch courses by category',
            loading: false
          });
        }
      },

      searchCourses: async (keyword: string, groupCode: string = 'GP01', page: number = 1, pageSize: number = 12) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${keyword}&MaNhom=${groupCode}`);
          const courses = response.data;

          // Client-side pagination for search since API doesn't support pagination for this endpoint
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedCourses = courses.slice(startIndex, endIndex);
          const totalCount = courses.length;
          const totalPages = Math.ceil(totalCount / pageSize);

          set({
            courses: paginatedCourses,
            currentPage: page,
            totalCount,
            totalPages,
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to search courses',
            loading: false
          });
        }
      },

      fetchCoursesByGroup: async (groupCode: string, page: number = 1, pageSize: number = 12) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?page=${page}&pageSize=${pageSize}&MaNhom=${groupCode}`);

          const { items: courses, totalCount } = response.data;

          // Calculate total pages
          const totalPages = Math.ceil(totalCount / pageSize);

          // Sort courses by views (luotXem) in descending order for featured courses (only if on first page)
          const sortedByViews = page === 1 ? [...courses].sort((a, b) => (b.luotXem || 0) - (a.luotXem || 0)) : [];

          set({
            courses,
            featuredCourses: page === 1 ? sortedByViews.slice(0, 6) : get().featuredCourses, // Top 6 most viewed courses only on first page
            currentPage: page,
            totalCount,
            totalPages,
            loading: false
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch courses by group',
            loading: false
          });
        }
      },
    }),
    { name: 'course-store' }
  )
);