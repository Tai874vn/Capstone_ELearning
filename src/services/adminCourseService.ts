import api from './api';
import type {
  Course,
  CourseListResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseCategory,
  EnrollmentRequest,
  User,
  PendingStudent,
  ApprovedStudent
} from '@/types/Index';

export const adminCourseService = {
  // Get all courses
  getAllCourses: async (maNhom: string = 'GP01'): Promise<Course[]> => {
    const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
      params: { MaNhom: maNhom }
    });
    return response.data;
  },

  // Get courses with pagination (using LayDanhSachKhoaHoc and client-side pagination)
  getCoursesPaginated: async (
    page: number = 1,
    pageSize: number = 10,
    tenKhoaHoc: string = ''
  ): Promise<CourseListResponse> => {
    // Build params object
    const params: any = {
      MaNhom: 'GP01'
    };

    if (tenKhoaHoc && tenKhoaHoc.trim() !== '') {
      params.tenKhoaHoc = tenKhoaHoc;
    }

    // Get all courses
    const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
      params
    });

    let allCourses = Array.isArray(response.data) ? response.data : [];

    // Filter by course name if search term provided
    if (tenKhoaHoc && tenKhoaHoc.trim() !== '') {
      allCourses = allCourses.filter((course: any) =>
        course.tenKhoaHoc?.toLowerCase().includes(tenKhoaHoc.toLowerCase())
      );
    }

    const totalCount = allCourses.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCourses = allCourses.slice(startIndex, endIndex);

    return {
      currentPage: page,
      count: paginatedCourses.length,
      totalPage: totalPages,
      totalCount: totalCount,
      items: paginatedCourses
    };
  },

  // Get course categories
  getCategories: async (): Promise<CourseCategory[]> => {
    const response = await api.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
    return response.data;
  },

  // Get course detail
  getCourseDetail: async (maKhoaHoc: string): Promise<Course> => {
    const response = await api.get('/QuanLyKhoaHoc/LayThongTinKhoaHoc', {
      params: { maKhoaHoc }
    });
    return response.data;
  },

  // Create new course
  createCourse: async (courseData: CreateCourseRequest): Promise<Course> => {
    const response = await api.post('/QuanLyKhoaHoc/ThemKhoaHoc', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (courseData: UpdateCourseRequest): Promise<Course> => {
    const response = await api.put('/QuanLyKhoaHoc/CapNhatKhoaHoc', courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (maKhoaHoc: string): Promise<void> => {
    await api.delete('/QuanLyKhoaHoc/XoaKhoaHoc', {
      params: { MaKhoaHoc: maKhoaHoc }
    });
  },

  // Upload course image
  uploadCourseImage: async (formData: FormData): Promise<any> => {
    const response = await api.post('/QuanLyKhoaHoc/UploadHinhAnhKhoaHoc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get unenrolled students for a course
  getUnenrolledStudents: async (maKhoaHoc: string): Promise<User[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh', {
      maKhoaHoc
    });
    return response.data;
  },

  // Get students waiting for approval
  getPendingStudents: async (maKhoaHoc: string): Promise<PendingStudent[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet', {
      maKhoaHoc
    });
    return response.data;
  },

  // Get approved students
  getApprovedStudents: async (maKhoaHoc: string): Promise<ApprovedStudent[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc', {
      maKhoaHoc
    });
    return response.data;
  },

  // Enroll student in course (admin action)
  enrollStudent: async (enrollmentData: EnrollmentRequest): Promise<void> => {
    await api.post('/QuanLyKhoaHoc/GhiDanhKhoaHoc', enrollmentData);
  },

  // Cancel enrollment
  cancelEnrollment: async (enrollmentData: EnrollmentRequest): Promise<void> => {
    await api.post('/QuanLyKhoaHoc/HuyGhiDanh', enrollmentData);
  },
};
