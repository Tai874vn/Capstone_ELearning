import api from './api';
import type {
  User,
  UserListResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserType,
  EnrollmentRequest,
  Course
} from '@/types/Index';

export const adminUserService = {
  // Get all user types (GV/HV)
  getUserTypes: async (): Promise<UserType[]> => {
    const response = await api.get('/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung');
    return response.data;
  },

  // Get users with pagination
  getUsersPaginated: async (
    maNhom: string = 'GP01',
    tuKhoa: string = '',
    page: number = 1,
    pageSize: number = 10
  ): Promise<UserListResponse> => {
    // Build params object, only include tuKhoa if it has a value
    const params: any = {
      MaNhom: maNhom,
      page: page,
      pageSize: pageSize
    };

    if (tuKhoa && tuKhoa.trim() !== '') {
      params.tuKhoa = tuKhoa;
    }

    const response = await api.get('/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang', {
      params
    });

    // If response has pagination structure
    if (response.data && typeof response.data === 'object' && 'items' in response.data) {
      // API returns totalPages (plural), we need totalPage (singular)
      const apiData = response.data as any;
      return {
        currentPage: apiData.currentPage || page,
        count: apiData.count || 0,
        totalPage: apiData.totalPages || apiData.totalPage || 1,
        totalCount: apiData.totalCount || 0,
        items: apiData.items || []
      };
    }

    // If API returns array directly, wrap it
    if (Array.isArray(response.data)) {
      return {
        currentPage: page,
        count: response.data.length,
        totalPage: response.data.length === pageSize ? page + 1 : page,
        totalCount: response.data.length,
        items: response.data
      };
    }

    // Default empty response
    return {
      currentPage: page,
      count: 0,
      totalPage: 1,
      totalCount: 0,
      items: []
    };
  },

  // Search users
  searchUsers: async (maNhom: string = 'GP01', tuKhoa: string = ''): Promise<User[]> => {
    const response = await api.get('/QuanLyNguoiDung/TimKiemNguoiDung', {
      params: { MaNhom: maNhom, tuKhoa }
    });
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/QuanLyNguoiDung/ThemNguoiDung', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userData: UpdateUserRequest): Promise<User> => {
    const response = await api.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (taiKhoan: string): Promise<void> => {
    await api.delete('/QuanLyNguoiDung/XoaNguoiDung', {
      params: { TaiKhoan: taiKhoan }
    });
  },

  // Get courses user hasn't enrolled in
  getUnenrolledCourses: async (taiKhoan: string): Promise<Course[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh', null, {
      params: { TaiKhoan: taiKhoan }
    });
    return response.data;
  },

  // Get courses waiting for approval
  getPendingCourses: async (taiKhoan: string): Promise<Course[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet', {
      taiKhoan
    });
    return response.data;
  },

  // Get approved courses
  getApprovedCourses: async (taiKhoan: string): Promise<Course[]> => {
    const response = await api.post('/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet', {
      taiKhoan
    });
    return response.data;
  },
};
