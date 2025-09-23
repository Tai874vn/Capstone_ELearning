import api from './api';
import type { Course, CourseDetail, CourseCategory, EnrollmentInfo } from '../types/Index';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/QuanLyKhoaHoc/LayDanhSachKhoaHoc');
    return response.data;
  },

  async getCourseDetail(courseCode: string): Promise<CourseDetail> {
    const response = await api.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseCode}`);
    return response.data;
  },

  async getCategories(): Promise<CourseCategory[]> {
    const response = await api.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
    return response.data;
  },

  async getCoursesByCategory(categoryCode: string): Promise<Course[]> {
    const response = await api.get(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${categoryCode}`);
    return response.data;
  },

  async searchCourses(keyword: string): Promise<Course[]> {
    const response = await api.get(`/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${keyword}`);
    return response.data;
  },

  async enrollCourse(enrollmentData: EnrollmentInfo): Promise<void> {
    await api.post('/QuanLyKhoaHoc/DangKyKhoaHoc', enrollmentData);
  },

  async unenrollCourse(enrollmentData: EnrollmentInfo): Promise<void> {
    await api.post('/QuanLyKhoaHoc/HuyGhiDanh', enrollmentData);
  },

  async getEnrolledCourses(userAccount: string): Promise<Course[]> {
    const response = await api.get(`/QuanLyKhoaHoc/LayThongTinHocVienKhoaHoc?taiKhoan=${userAccount}`);
    return response.data;
  },
};